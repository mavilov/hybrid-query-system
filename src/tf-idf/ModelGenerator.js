/**
 *  This is the core logic for generating the TF-IDF model.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { tokenize } from './tokenizer.js'

export class ModelGenerator {
    /**
     * Creates a new ModelGenerator instance.
     *
     * @param {Function} tokenizerFn - The tokenizer function to use (default: tokenize).
     */
    constructor(tokenizerFn = tokenize) {
        this.tokenizer = tokenizerFn
    }

    /**
     * Generates the TF-IDF model components (vocabulary, IDF scores, and document vectors) from a corpus of documents.
     *
     * @param {string[]} corpus - Array of text documents.
     * @returns {object} The complete TF-IDF model object.
     */
    generate(corpus) {
        const tcAndDfResult = calculateTcAndDf(corpus)

        const numDocs = corpus.length

        const { idfScores, documentVectors } = calculateIdfAndTfidfVectors(tcAndDfResult, numDocs)

        return {
            corpus: corpus,
            vocabulary: Object.fromEntries(tcAndDfResult.vocabulary), // Map to Object for JSON serialization
            idfScores: idfScores,
            documentVectors: documentVectors,
        }
    }
}

/**
 * Calculates term counts and document frequency from a corpus.
 *
 * @param {string[]} corpus - Array of text documents.
 * @returns {object} Object with documentTermCounts, documentFrequency, and vocabulary.
 */
const calculateTcAndDf = (corpus) => {
    const documentTermCounts = [] // Stores {term: count} for each document
    const documentFrequency = new Map() // Stores {term: number of documents containing term}
    const vocabulary = new Map() // Stores {term: index in vector}
    let tokenIndex = 0

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
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1)
        })
    })

    return {
        documentTermCounts,
        documentFrequency,
        vocabulary,
    }
}

/**
 * Calculates IDF scores and TF-IDF document vectors.
 *
 * @param {object} tcAndDfResult - Result from calculateTcAndDf.
 * @param {number} numDocs - Number of documents in corpus.
 * @returns {object} Object with idfScores and documentVectors.
 */
const calculateIdfAndTfidfVectors = (tcAndDfResult, numDocs) => {
    const { documentTermCounts, documentFrequency, vocabulary } = tcAndDfResult
    const vectorLength = vocabulary.size
    const documentVectors = [] // Stores the final TF-IDF vector for each document
    const idfScores = {} // Stores the final IDF score for each term

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
        idfScores,
        documentVectors,
    }
}
