/**
 *  Contains the full, from-scratch implementation of TF-IDF and Cosine Similarity.
 *  This is the core logic for the Vector Search component.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import * as fs from 'node:fs'
import { TFIDF_PATH } from './config.js'

//TODO: this is a mess now and needs refactoring for readability and maintainability

/**
 * Simple, non-aggressive tokenizer. Converts text to lowercase and splits by non-word characters.
 * @param {string} text
 * @returns {string[]} An array of tokens (words).
 */
function tokenize(text) {
    // Simple preprocessing: lowercase and remove non-word characters except spaces
    const cleanText = text
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    // Split by whitespace and filter out empty strings
    return cleanText.split(/\s+/).filter((token) => token.length > 0)
}

/**
 * Generates the TF-IDF model components (vocabulary, IDF scores, and document vectors) from a corpus.
 * @param {string[]} corpus - Array of text documents.
 * @returns {object} The complete TF-IDF model object.
 */
export function generateTfIdfModel(corpus) {
    const documentTermCounts = [] // Stores {term: count} for each document
    const documentFrequency = new Map() // Stores {term: number of documents containing term}
    const vocabulary = new Map() // Stores {term: index in vector}
    let tokenIndex = 0

    // --- First Pass: Calculate Term Counts and Document Frequency ---
    corpus.forEach((docText) => {
        const tokens = tokenize(docText)
        const docCounts = {} // Counts for the current document
        const uniqueTokens = new Set() // For DF calculation

        tokens.forEach((token) => {
            docCounts[token] = (docCounts[token] || 0) + 1
            uniqueTokens.add(token)
            if (!vocabulary.has(token)) {
                vocabulary.set(token, tokenIndex++)
            }
        })
        documentTermCounts.push(docCounts)

        uniqueTokens.forEach((token) => {
            documentFrequency.set(
                token,
                (documentFrequency.get(token) || 0) + 1
            )
        })
    })

    const numDocs = corpus.length
    const vectorLength = vocabulary.size
    const documentVectors = [] // Stores the final TF-IDF vector for each document
    const idfScores = {} // Stores the final IDF score for each term

    // --- Second Pass: Calculate IDF and TF-IDF Vectors ---

    // Calculate IDF scores
    documentFrequency.forEach((df, term) => {
        // IDF = log(N / df) where N is number of documents, df is document frequency
        idfScores[term] = Math.log(numDocs / df)
    })

    // Calculate TF-IDF vectors
    documentTermCounts.forEach((docCounts) => {
        const vector = new Array(vectorLength).fill(0)

        Object.entries(docCounts).forEach(([term, count]) => {
            const tf = count // Simple term frequency (could be normalized, but raw count is simple)
            const idf = idfScores[term]
            const index = vocabulary.get(term)

            // TF-IDF = TF * IDF
            vector[index] = tf * idf
        })
        documentVectors.push(vector)
    })

    return {
        corpus: corpus,
        vocabulary: Object.fromEntries(vocabulary), // Map to Object for JSON serialization
        idfScores: idfScores,
        documentVectors: documentVectors,
    }
}

// Helper for vector operations
const vectorMath = {
    /**
     * Calculates the magnitude (L2-norm) of a vector.
     * @param {number[]} vector
     * @returns {number}
     */
    magnitude: (vector) => {
        return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    },

    /**
     * Calculates the dot product of two vectors.
     * @param {number[]} vecA
     * @param {number[]} vecB
     * @returns {number}
     */
    dotProduct: (vecA, vecB) => {
        if (vecA.length !== vecB.length) {
            console.warn(
                'Vector length mismatch in dot product!',
                vecA.length,
                vecB.length
            )
            return 0
        }
        return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0)
    },

    /**
     * Calculates the Cosine Similarity between two vectors.
     * @param {number[]} vecA
     * @param {number[]} vecB
     * @returns {number}
     */
    cosineSimilarity: (vecA, vecB) => {
        const dot = vectorMath.dotProduct(vecA, vecB)
        const magA = vectorMath.magnitude(vecA)
        const magB = vectorMath.magnitude(vecB)

        // Avoid division by zero
        if (magA === 0 || magB === 0) return 0

        // Cosine Similarity = (A . B) / (|A| * |B|)
        return dot / (magA * magB)
    },
}

/**
 * Converts a query string into a TF-IDF vector using the pre-calculated model.
 * @param {string} queryText
 * @param {object} model - The loaded TF-IDF model.
 * @returns {number[]} The query vector.
 */
function queryToVector(queryText, model) {
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
 * @param {string} queryText - The user's search query.
 * @param {number} topK - Number of top results to return.
 * @returns {{text: string, score: number}[]} Array of ranked results.
 */
export function vectorSearch(queryText, topK = 3) {
    if (!fs.existsSync(TFIDF_PATH)) {
        console.error(
            `Error: TF-IDF model file not found at ${TFIDF_PATH}. Did you run 'npm run setup'?`
        )
        return []
    }

    // Load the model from the file system
    const modelJson = fs.readFileSync(TFIDF_PATH, 'utf-8')
    const model = JSON.parse(modelJson)

    // Vectorize the query
    const queryVec = queryToVector(queryText, model)

    // Calculate similarity with all document vectors
    const results = model.documentVectors.map((docVec, index) => {
        const score = vectorMath.cosineSimilarity(queryVec, docVec)
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
