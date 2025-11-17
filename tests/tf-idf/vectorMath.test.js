/**
 * Tests for vectorMath.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import { vectorMath } from '../../src/tf-idf/vectorMath.js'

suite('vectorMath.magnitude() tests', () => {
    test('calculates magnitude of simple vector', () => {
        const vector = [3, 4]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 5) // 3-4-5 triangle
    })

    test('calculates magnitude of unit vector', () => {
        const vector = [1, 0, 0]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 1)
    })

    test('calculates magnitude of zero vector', () => {
        const vector = [0, 0, 0]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 0)
    })

    test('handles single element vector', () => {
        const vector = [5]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 5)
    })

    test('handles negative values', () => {
        const vector = [-3, -4]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 5) // magnitude is always positive
    })

    test('handles mixed positive/negative', () => {
        const vector = [3, -4, 0]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 5)
    })

    test('handles large numbers', () => {
        const vector = [1000, 2000]
        const result = vectorMath.magnitude(vector)
        const expected = Math.sqrt(1000 * 1000 + 2000 * 2000)
        assert.strictEqual(result, expected)
    })

    test('handles decimal values', () => {
        const vector = [0.3, 0.4]
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 0.5)
    })

    test('handles empty vector', () => {
        const vector = []
        const result = vectorMath.magnitude(vector)
        assert.strictEqual(result, 0)
    })

    test('handles high-dimensional vector', () => {
        const vector = new Array(100).fill(1)
        const result = vectorMath.magnitude(vector)
        const expected = Math.sqrt(100)
        assert.strictEqual(result, expected)
    })
})
// --- dotProduct() tests ---

suite('vectorMath.dotProduct() tests', () => {
    test('calculates dot product of simple vectors', () => {
        const vecA = [1, 2, 3]
        const vecB = [4, 5, 6]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 1 * 4 + 2 * 5 + 3 * 6) // 32
    })

    test('calculates dot product of orthogonal vectors', () => {
        const vecA = [1, 0, 0]
        const vecB = [0, 1, 0]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 0)
    })

    test('calculates dot product of parallel vectors', () => {
        const vecA = [2, 4, 6]
        const vecB = [1, 2, 3]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 2 * 1 + 4 * 2 + 6 * 3) // 28
    })

    test('handles negative values', () => {
        const vecA = [1, -2, 3]
        const vecB = [2, 1, -1]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 1 * 2 + -2 * 1 + 3 * -1) // -3
    })

    test('handles zero vectors', () => {
        const vecA = [0, 0, 0]
        const vecB = [1, 2, 3]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 0)
    })

    test('handles single element vectors', () => {
        const vecA = [5]
        const vecB = [3]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 15)
    })

    test('handles decimal values', () => {
        const vecA = [0.5, 1.5]
        const vecB = [2.0, 1.0]
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 0.5 * 2.0 + 1.5 * 1.0) // 2.5
    })

    test('warns and throws an exception for mismatched lengths', () => {
        let warnCalled = false
        let warnMsg = ''
        const originalWarn = console.warn
        console.warn = (msg) => {
            warnCalled = true
            warnMsg = msg
        }

        try {
            const vecA = [1, 2, 3]
            const vecB = [1, 2]
            assert.throws(() => vectorMath.dotProduct(vecA, vecB), /Vector length mismatch/)

            assert.strictEqual(warnCalled, true)
            assert.match(warnMsg, /Vector length mismatch/)
        } finally {
            console.warn = originalWarn
        }
    })

    test('handles high-dimensional vectors', () => {
        const vecA = new Array(1000).fill(1)
        const vecB = new Array(1000).fill(2)
        const result = vectorMath.dotProduct(vecA, vecB)
        assert.strictEqual(result, 2000) // 1000 * (1 * 2)
    })
})

suite('vectorMath.cosineSimilarity() tests', () => {
    test('calculates similarity of identical vectors', () => {
        const vecA = [1, 2, 3]
        const vecB = [1, 2, 3]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 1) // identical vectors have similarity 1
    })

    test('calculates similarity of orthogonal vectors', () => {
        const vecA = [1, 0, 0]
        const vecB = [0, 1, 0]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 0) // orthogonal vectors have similarity 0
    })

    test('calculates similarity of opposite vectors', () => {
        const vecA = [1, 0, 0]
        const vecB = [-1, 0, 0]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, -1) // opposite vectors have similarity -1
    })

    test('calculates similarity of scalar multiples', () => {
        const vecA = [1, 2, 3]
        const vecB = [2, 4, 6] // 2x of vecA
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 1) // scalar multiples are identical direction
    })

    test('handles zero vector as first argument', () => {
        const vecA = [0, 0, 0]
        const vecB = [1, 2, 3]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 0) // zero vector similarity is 0
    })

    test('handles zero vector as second argument', () => {
        const vecA = [1, 2, 3]
        const vecB = [0, 0, 0]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 0)
    })

    test('handles both zero vectors', () => {
        const vecA = [0, 0, 0]
        const vecB = [0, 0, 0]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 0)
    })

    test('handles negative values', () => {
        const vecA = [1, -1, 0]
        const vecB = [1, -1, 0]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(1 - result < 1e-10, true) // very close to 1
    })

    test('is symmetric', () => {
        const vecA = [1, 2, 3]
        const vecB = [4, 5, 6]
        const result1 = vectorMath.cosineSimilarity(vecA, vecB)
        const result2 = vectorMath.cosineSimilarity(vecB, vecA)
        assert.strictEqual(result1, result2)
    })

    test('handles decimal values', () => {
        const vecA = [0.5, 0.5]
        const vecB = [0.5, 0.5]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(1 - result < 1e-10, true) // very close to 1
    })

    test('handles single element vectors', () => {
        const vecA = [5]
        const vecB = [10]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 1) // same direction
    })

    test('handles high-dimensional vectors', () => {
        const vecA = new Array(100).fill(1)
        const vecB = new Array(100).fill(1)
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result, 1)
    })

    test('result is between -1 and 1', () => {
        const testVectors = [
            { a: [1, 2, 3], b: [4, 5, 6] },
            { a: [1, 0, 0], b: [1, 1, 1] },
            { a: [-1, -2], b: [1, 2] },
            { a: [0.1, 0.2], b: [5, 10] },
        ]

        testVectors.forEach(({ a, b }) => {
            const result = vectorMath.cosineSimilarity(a, b)
            assert.strictEqual(result >= -1, true)
            assert.strictEqual(result <= 1, true)
        })
    })

    test('real-world TF-IDF example', () => {
        // Two documents with similar vocabulary
        const doc1Vector = [0.5, 0.3, 0.8, 0, 0.2]
        const doc2Vector = [0.5, 0.3, 0.8, 0, 0.2]
        const result = vectorMath.cosineSimilarity(doc1Vector, doc2Vector)
        assert.strictEqual(result, 1) // identical documents
    })

    test('handles very small differences', () => {
        const vecA = [1, 2, 3]
        const vecB = [1.0001, 2.0001, 3.0001]
        const result = vectorMath.cosineSimilarity(vecA, vecB)
        assert.strictEqual(result > 0.9999, true) // very close to 1
    })
})
