/**
 * Implements vector search using TF-IDF and Cosine Similarity.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { tokenize } from './tokenizer.js'
import { cosineSimilarity } from './vectorMath.js'
import * as fs from 'node:fs'

/**
 * Converts a query string into a TF-IDF vector using the pre-calculated model.
 *
 * @param {string} queryText
 * @param {object} model - The loaded TF-IDF model.
 * @returns {number[]} The query vector.
 */
const queryToVector = (queryText, model) => {
    const queryTokens = tokenize(queryText)
    const vectorLength = Object.keys(model.vocabulary).length
    const queryVector = new Array(vectorLength).fill(0)
    const vocabIndex = model.vocabulary

    // Calculate Term Frequency (TF) for the query
    const queryCounts = {}
    queryTokens.forEach((token) => {
        queryCounts[token] = (queryCounts[token] || 0) + 1
    })

    // Build the query vector (TF-IDF)
    Object.entries(queryCounts).forEach(([term, tf]) => {
        const index = vocabIndex[term]
        const idf = model.idfScores[term] || 0 // Term not in corpus gets IDF of 0 (no contribution)

        if (index !== undefined) {
            queryVector[index] = tf * idf
        }
    })

    return queryVector
}

/**
 * Performs vector search against the document vectors.
 *
 * @param {string} queryText - The user's search query.
 * @param {number} topK - Number of top results to return, three by default.
 * @returns {{text: string, score: number}[]} Array of ranked results.
 */
export const vectorSearch = (queryText, modelPath, topK = 3) => {
    if (!fs.existsSync(modelPath)) {
        console.error(
            `Error: TF-IDF model file not found at ${modelPath}. Did you run 'npm run setup'?`
        )
        return []
    }

    const modelJson = fs.readFileSync(modelPath, 'utf-8')
    const model = JSON.parse(modelJson)

    // Vectorize the query
    const queryVec = queryToVector(queryText, model)

    // Calculate similarity with all document vectors
    const results = model.documentVectors.map((docVec, index) => {
        const score = cosineSimilarity(queryVec, docVec)
        return {
            text: model.corpus[index],
            score: score,
        }
    })

    // Sort and return top K results
    return results
        .filter((r) => r.score > 0) // Only include documents that have some match
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
}
