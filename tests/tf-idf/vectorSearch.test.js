/**
 * Tests for vectorSearch.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { TFIDF_MODEL_PATH } from '../../src/config.js'

const ensureDataDir = () => {
    const dir = path.dirname(TFIDF_MODEL_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const writeModel = (model) => {
    ensureDataDir()
    fs.writeFileSync(TFIDF_MODEL_PATH, JSON.stringify(model), 'utf8')
}

const removeModel = () => {
    try {
        fs.unlinkSync(TFIDF_MODEL_PATH)
        // eslint-disable-next-line no-unused-vars
    } catch (e) {
        // Ignore errors if file does not exist
    }
}

suite('vectorSearch', () => {
    test('returns [] and logs error when model file missing', async () => {
        removeModel()

        let errMsg = ''
        const origErr = console.error
        console.error = (msg) => {
            errMsg += String(msg)
        }

        try {
            const { vectorSearch } = await import('../../src/tf-idf/vectorSearch.js')
            const res = vectorSearch('apple')
            assert.deepStrictEqual(res, [])
            assert.match(errMsg, /TF-IDF model file not found/)
            assert.match(errMsg, new RegExp(path.basename(TFIDF_MODEL_PATH)))
        } finally {
            console.error = origErr
        }
    })

    test('returns topK ordered results for a simple model', async () => {
        removeModel()

        // Build a tiny model:
        // vocab: apple -> 0, banana -> 1
        // idfScores: both 1
        // doc vectors: doc0 [1,0], doc1 [0,1], doc2 [1,1]
        const model = {
            corpus: ['doc-apple', 'doc-banana', 'doc-both'],
            vocabulary: { apple: 0, banana: 1 },
            idfScores: { apple: 1, banana: 1 },
            documentVectors: [
                [1, 0],
                [0, 1],
                [1, 1],
            ],
        }
        writeModel(model)

        try {
            const { vectorSearch } = await import('../../src/tf-idf/vectorSearch.js')
            const res = vectorSearch('apple', 3)
            // Expect doc-apple (score 1) first, doc-both (score ~0.707) second
            assert.strictEqual(res.length, 2)
            assert.strictEqual(res[0].text, 'doc-apple')
            assert.strictEqual(res[1].text, 'doc-both')
            assert.ok(res[0].score > res[1].score)
            // topK trimming
            const res1 = vectorSearch('apple', 1)
            assert.strictEqual(res1.length, 1)
            assert.strictEqual(res1[0].text, 'doc-apple')
        } finally {
            removeModel()
        }
    })

    test('returns [] when query tokens not in vocabulary', async () => {
        removeModel()

        const model = {
            corpus: ['doc1'],
            vocabulary: { apple: 0 },
            idfScores: { apple: 1 },
            documentVectors: [[1]],
        }
        writeModel(model)

        try {
            const { vectorSearch } = await import('../../src/tf-idf/vectorSearch.js')
            const res = vectorSearch('orange', 3)
            assert.deepStrictEqual(res, [])
        } finally {
            removeModel()
        }
    })
})
