/**
 *  LLM query decomposition module
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { OLLAMA_MODEL, OLLAMA_URL } from '../config.js'
import { setTimeout } from 'timers/promises'
import { systemInstruction } from './system_instruction.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Calls the Ollama API to decompose the user's natural language query into
 * a structured, machine-readable format for routing and retrieval.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} Parsed JSON response from the LLM.
 */
export const decomposeQuery = async (query) => {
    console.log('Calling Ollama LLM for Query Decomposition and Planning...')

    const fullPrompt = `${systemInstruction}\n\nUser question to decompose: "${query}"`

    const ollamaRequestPayload = {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        format: 'json',
        options: {
            temperature: 0.0, // Ensure deterministic query planning
        },
    }

    let attempt = 0
    const maxRetries = 3

    while (attempt < maxRetries) {
        try {
            const jsonText = await _queryOllama(ollamaRequestPayload)
            return JSON.parse(jsonText.trim())
        } catch (error) {
            attempt++
            console.error(`LLM Decomposition Attempt ${attempt} failed: ${error.message}`)
            if (attempt < maxRetries) {
                await setTimeout(1000) // No need for an exponential backoff with the local Ollama server in the test assignment
                console.log('Retrying...')
            } else {
                console.error(
                    'Failed to decompose query after multiple retries. Check if Ollama is running and the model is downloaded.'
                )
                throw error
            }
        }
    }
}

const _queryOllama = async (reqPayload) => {
    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqPayload),
    })

    if (!response.ok) {
        if (response.status === StatusCodes.TOO_MANY_REQUESTS) {
            throw new Error(`Rate limit exceeded. Retrying...`)
        }
        const errorBody = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Body: ${errorBody}`)
    }

    const result = await response.json()
    const jsonText = result.response

    if (!jsonText) {
        throw new Error('Ollama response was empty or malformed.')
    }

    // The model is instructed to return *only* JSON, so we parse it directly.
    // Note: Some models wrap the JSON in ```json...``` even when asked not to. We must be ready to clean this up.
    let cleanedJsonText = jsonText.trim()
    if (cleanedJsonText.startsWith('```json')) {
        // TODO: consider regex for more robust cleaning or maybe skipping outside of { and }
        cleanedJsonText = cleanedJsonText.substring(7, cleanedJsonText.lastIndexOf('```'))
    }
    if (cleanedJsonText.startsWith('```')) {
        cleanedJsonText = cleanedJsonText.substring(3, cleanedJsonText.lastIndexOf('```'))
    }
    return cleanedJsonText
}
