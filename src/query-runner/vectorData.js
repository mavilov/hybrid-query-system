/**
 *  Performs vector search and formats the results
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { vectorSearch } from '../tf-idf/vectorSearch.js'
import { TFIDF_MODEL_PATH } from '../config.js'

/**
 * Performs vector search and formats the results.
 * @param {string} searchTerm - The query term for vector search.
 * @returns {string} The formatted results as a string.
 */
export const retrieveVectorData = (searchTerm) => {
    console.log(`Executing Vector Search for: "${searchTerm}"`)
    const results = vectorSearch(searchTerm, TFIDF_MODEL_PATH, 3)

    if (results.length === 0) {
        return 'No relevant documents found in the vector store.'
    }

    return `Vector Search Results (Advisories): [${_formatResults(results)}]`
}

/**
 * Format results into a string, showing content and score
 */
const _formatResults = (results) =>
    results.map((r, i) => `[Rank ${i + 1}, Score: ${r.score.toFixed(3)}]: ${r.text}`).join(' | ')
