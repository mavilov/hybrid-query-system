/**
 * Helper module for vector math operations.
 * Implements vector math operations: magnitude, dot product, and cosine similarity.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

/**
 * Calculates the magnitude (L2-norm) of a vector.
 * It's the generalized form of the formula to find the hypotenuse of a 90-degree triangle, a^2+b^2 = c^2
 * @param {number[]} vector
 * @returns {number} L2-norm (magnitude) of the vector
 */
const magnitude = (vector) => Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))

/**
 * Calculates the dot product of two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Dot product of the two vectors
 */
const dotProduct = (vecA, vecB) => {
    if (vecA.length !== vecB.length) {
        console.warn('Vector length mismatch in dot product!', vecA.length, vecB.length)
        throw new Error('Vector length mismatch in dot product')
    }
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0)
}

/**
 * Calculates the Cosine Similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Cosine similarity between the two vectors
 */
export const cosineSimilarity = (vecA, vecB) => {
    const dot = dotProduct(vecA, vecB)
    const magA = magnitude(vecA)
    const magB = magnitude(vecB)

    // Avoid division by zero
    if (magA === 0 || magB === 0) return 0

    // Cosine Similarity = (A . B) / (|A| * |B|)
    return dot / (magA * magB)
}

export { magnitude, dotProduct } // Exporting for testing purposes
