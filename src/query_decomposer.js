/**
 *  LLM query decomposition module
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { OLLAMA_MODEL, OLLAMA_URL } from './config.js'
import { setTimeout } from 'timers/promises'

// TODO: systemInstruction could be externalized to a separate file for easier maintenance
// TODO: systemInstruction could be parameterized for different database schemas or retrieval types
/**
 * Calls the Ollama API to decompose the user's natural language query into
 * a structured, machine-readable format for routing and retrieval.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} Parsed JSON response from the LLM.
 */
export async function decomposeQuery(query) {
    console.log('Calling Ollama LLM for Query Decomposition and Planning...')

    // The system instruction defines the role and the exact JSON output format
    const systemInstruction = `You are a sophisticated hybrid query router for a vulnerability database. Your task is the exact data retrieval steps required. The retrieval system has two sources:
1. SQL: A database with:
    - packages (package_id, name, repository)
    - vulnerabilities (vuln_id, package_id, version_start, version_end, severity, cve_id, summary)
2. VECTOR: An unstructured text corpus containing detailed vulnerability advisories, security best practices (npm, maven, etc.), and general security guidance.

Analyze the user's question and determine the single best plan in the required JSON format.
- IF the query is about specific package names, versions, or CVE lookups, the 'type' is SQL.
- IF the query is about general security best practices or detailed advisory text, the 'type' is VECTOR.
- IF the query requires SQL results (e.g., finding the CVE for a package) to inform a VECTOR search (e.g., finding the detailed advisory for that CVE), the 'type' is HYBRID.
- ALWAYS generate a 'finalAnswerPrompt' which is a single-sentence instruction to synthesize the final answer.

Required JSON Schema:
{
    "type": "SQL" | "VECTOR" | "HYBRID",
    "sqlQuery": "STRING (required and not empty if type is SQL or HYBRID. Use JOINs and WHERE clauses to retrieve all related vulnerability data for a package name.)",
    "vectorSearchTerm": "STRING (required if type is VECTOR or HYBRID. The optimized search query.)",
    "finalAnswerPrompt": "STRING (The synthesis instruction for the final answer.)"
}

You must respond ONLY with the JSON object. Do not include any explanation or markdown formatting.
`

    const fullPrompt = `${systemInstruction}\n\nUser question to decompose: "${query}"`

    const ollamaRequestPayload = {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        format: 'json',
        options: {
            temperature: 0.0, // Ensure deterministic planning
        },
    }

    let attempt = 0
    const maxRetries = 3

    while (attempt < maxRetries) {
        try {
            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ollamaRequestPayload),
            })

            if (!response.ok) {
                if (response.status === 429) {
                    // TODO: use HTTP status code constant
                    throw new Error(`Rate limit exceeded. Retrying...`)
                }
                const errorBody = await response.text()
                throw new Error(
                    `HTTP error! status: ${response.status}. Body: ${errorBody}`
                )
            }

            const result = await response.json()
            const jsonText = result.response

            if (!jsonText) {
                throw new Error('Ollama response was empty or malformed.')
            }

            // The model is instructed to return *only* JSON, so we parse it directly.
            // Note: Some models wrap the JSON in ```json...``` even when asked not to. We must clean this.
            let cleanedJsonText = jsonText.trim()
            if (cleanedJsonText.startsWith('```json')) {
                // TODO: consider regex for more robust cleaning or maybe skipping outside of { and }
                cleanedJsonText = cleanedJsonText.substring(
                    7,
                    cleanedJsonText.lastIndexOf('```')
                )
            }
            if (cleanedJsonText.startsWith('```')) {
                cleanedJsonText = cleanedJsonText.substring(
                    3,
                    cleanedJsonText.lastIndexOf('```')
                )
            }

            return JSON.parse(cleanedJsonText.trim())
        } catch (error) {
            attempt++
            console.error(
                `LLM Decomposition Attempt ${attempt} failed: ${error.message}`
            )
            if (attempt < maxRetries) {
                await setTimeout(1000) // We don't need an exponential backoff with the local Ollama server
                console.log('Retrying...')
            } else {
                console.error(
                    'Failed to decompose query after multiple retries. Check if Ollama is running and the model is downloaded.'
                )
                return null // TODO: consider throwing an error instead or returning status object
            }
        }
    }
}
