/**
 *  Answer Synthesis Logic
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { OLLAMA_MODEL, OLLAMA_URL } from '../config.js'

/**
 * Uses the LLM to synthesize a final answer from all gathered context.
 * @param {string} query - Original user query.
 * @param {string} context - All retrieved data (SQL and Vector).
 * @param {string} finalPrompt - Instruction from the decomposition step.
 * @returns {Promise<string>} The synthesized natural language answer.
 */
export const synthesizeAnswer = async (query, context, finalPrompt) => {
    console.log('Synthesizing Final Answer (via Ollama)...')

    const systemInstruction = `
You are a helpful security assistant. Your job is to answer the user's original question based ONLY on the provided context (the retrieved data).
The instruction you MUST follow is: "${finalPrompt}".
If the context is empty or irrelevant, state that you cannot find the answer. When reporting package vulnerabilities, be sure to clearly state 
the affected version ranges and severity.`

    const synthesisQuery = `Original User Query: "${query}"\n\n--- Context Data ---\n${context}`

    const fullPrompt = `${systemInstruction}\n\n${synthesisQuery}`

    //TODO introduce log levels and make this debug console.log('Final Synthesis Prompt Sent to Ollama:\n', fullPrompt)

    const ollamaRequestPayload = {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
            temperature: 0.1, // Allow for some creativity and variability in synthesis
        },
    }

    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ollamaRequestPayload),
        })

        const result = await response.json()
        const text = result.response
        return text || 'Error: Failed to synthesize answer.'
    } catch (error) {
        console.error(`Synthesis Error: ${error.message}`)
        return 'System Error: Could not reach synthesis engine. Check if Ollama is running.'
    }
}
