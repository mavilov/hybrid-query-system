/**
 * Tests for ModelGenerator.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import { ModelGenerator } from '../../src/tf-idf/ModelGenerator.js'
import { tokenize } from '../../src/tf-idf/tokenizer.js'

suite('ModelGenerator constructor', () => {
    test('initializes with default tokenizer', () => {
        const generator = new ModelGenerator()
        assert.strictEqual(typeof generator.tokenizer, 'function')
        assert.strictEqual(generator.tokenizer, tokenize)
    })

    test('accepts custom tokenizer', () => {
        const customTokenizer = (text) => text.split(' ')
        const generator = new ModelGenerator(customTokenizer)
        assert.strictEqual(generator.tokenizer, customTokenizer)
    })
})

suite('ModelGenerator.generate()', () => {
    test('returns model object with required properties', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe']
        const model = generator.generate(corpus)

        assert.strictEqual(Array.isArray(model.corpus), true)
        assert.strictEqual(typeof model.vocabulary, 'object')
        assert.strictEqual(typeof model.idfScores, 'object')
        assert.strictEqual(Array.isArray(model.documentVectors), true)
    })

    test('corpus matches input', () => {
        const generator = new ModelGenerator()
        const corpus = ['document one', 'document two', 'document three']
        const model = generator.generate(corpus)

        assert.deepStrictEqual(model.corpus, corpus)
    })

    test('vocabulary contains all unique tokens', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe']
        const model = generator.generate(corpus)

        assert.strictEqual(Object.keys(model.vocabulary).length, 3)
        assert.strictEqual(typeof model.vocabulary.hello, 'number')
        assert.strictEqual(typeof model.vocabulary.world, 'number')
        assert.strictEqual(typeof model.vocabulary.universe, 'number')
    })

    test('idfScores calculated for all vocabulary terms', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe', 'world peace']
        const model = generator.generate(corpus)

        const vocabTerms = Object.keys(model.vocabulary)
        vocabTerms.forEach((term) => {
            assert.strictEqual(typeof model.idfScores[term], 'number')
            assert.strictEqual(model.idfScores[term] > 0, true)
        })
    })

    test('documentVectors has one vector per document', () => {
        const generator = new ModelGenerator()
        const corpus = ['doc1', 'doc2', 'doc3', 'doc4']
        const model = generator.generate(corpus)

        assert.strictEqual(model.documentVectors.length, corpus.length)
    })

    test('each vector has length equal to vocabulary size', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe', 'world peace']
        const model = generator.generate(corpus)

        const vocabSize = Object.keys(model.vocabulary).length
        model.documentVectors.forEach((vector) => {
            assert.strictEqual(vector.length, vocabSize)
        })
    })

    test('IDF values are positive', () => {
        const generator = new ModelGenerator()
        const corpus = ['apple banana cherry', 'banana cherry date', 'cherry date elderberry']
        const model = generator.generate(corpus)

        Object.values(model.idfScores).forEach((idf) => {
            assert.strictEqual(idf >= 0, true)
        })
    })

    test('handles single document', () => {
        const generator = new ModelGenerator()
        const corpus = ['single document']
        const model = generator.generate(corpus)

        assert.strictEqual(model.corpus.length, 1)
        assert.strictEqual(model.documentVectors.length, 1)
    })

    test('handles empty corpus', () => {
        const generator = new ModelGenerator()
        const corpus = []
        const model = generator.generate(corpus)

        assert.strictEqual(model.corpus.length, 0)
        assert.strictEqual(model.documentVectors.length, 0)
    })

    test('vocabulary indices are sequential starting from 0', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe']
        const model = generator.generate(corpus)

        const indices = Object.values(model.vocabulary).sort((a, b) => a - b)
        indices.forEach((idx, i) => {
            assert.strictEqual(idx, i)
        })
    })

    test('TF-IDF values are non-negative', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe', 'world peace']
        const model = generator.generate(corpus)

        model.documentVectors.forEach((vector) => {
            vector.forEach((value) => {
                assert.strictEqual(value >= 0, true)
            })
        })
    })

    test('handles repeated terms correctly', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello hello hello', 'world']
        const model = generator.generate(corpus)

        // First document should have non-zero value for 'hello'
        const helloIdx = model.vocabulary.hello
        assert.strictEqual(model.documentVectors[0][helloIdx] > 0, true)

        // Second document should have zero value for 'hello'
        assert.strictEqual(model.documentVectors[1][helloIdx], 0)
    })

    test('common terms have lower IDF', () => {
        const generator = new ModelGenerator()
        const corpus = ['the the the', 'the and', 'and or']
        const model = generator.generate(corpus)

        const theIdf = model.idfScores.the // Appears in 2/3 documents
        const orIdf = model.idfScores.or // Appears in 1/3 documents

        assert.strictEqual(theIdf < orIdf, true)
    })

    test('vocabulary is case-insensitive', () => {
        const generator = new ModelGenerator()
        const corpus = ['Hello HELLO hello']
        const model = generator.generate(corpus)

        // All variations should be tokenized to lowercase 'hello'
        assert.strictEqual(model.vocabulary.hello !== undefined, true)
    })

    test('handles documents with punctuation', () => {
        const generator = new ModelGenerator()
        const corpus = ['Hello, world!', 'Hello? Universe!']
        const model = generator.generate(corpus)

        assert.strictEqual(Object.keys(model.vocabulary).length > 0, true)
        assert.strictEqual(model.documentVectors.length, 2)
    })

    test('document vector sparsity (many zeros)', () => {
        const generator = new ModelGenerator()
        const corpus = ['apple banana cherry', 'date elderberry fig', 'grape honeydew']
        const model = generator.generate(corpus)

        // With diverse vocabulary and short docs, vectors should be sparse
        let zeroCount = 0
        let nonZeroCount = 0

        model.documentVectors.forEach((vector) => {
            vector.forEach((val) => {
                if (val === 0) zeroCount++
                else nonZeroCount++
            })
        })

        assert.strictEqual(zeroCount > nonZeroCount, true)
    })

    test('returns serializable model (no Map/Set)', () => {
        const generator = new ModelGenerator()
        const corpus = ['hello world', 'hello universe']
        const model = generator.generate(corpus)

        // Should be JSON serializable
        const json = JSON.stringify(model)
        assert.strictEqual(typeof json, 'string')
        assert.strictEqual(json.length > 0, true)

        const parsed = JSON.parse(json)
        assert.deepStrictEqual(parsed.vocabulary, model.vocabulary)
    })

    test('handles real-world vulnerability text', () => {
        const generator = new ModelGenerator()
        const corpus = [
            'Predictable Value Range from Previous Values. Affecting form-data package, versions <2.5.4>=3.0.0 <3.0.4>=4.0.0 <4.0.4.',
            'CVE-2025-7783 CWE-343 How to fix? Upgrade form-data to version 2.5.4, 3.0.4, 4.0.4 or higher.',
        ]
        const model = generator.generate(corpus)

        assert.strictEqual(model.corpus.length, 2)
        assert.strictEqual(Object.keys(model.vocabulary).length > 0, true)
        assert.strictEqual(model.documentVectors.length, 2)
    })
})

suite('ModelGenerator.generateWithTokenizer()', () => {
    test('uses custom tokenizer', () => {
        const customTokenizer = (text) => text.split('|')
        const generator = new ModelGenerator(customTokenizer)
        const corpus = ['hello|world', 'hello|universe']
        const model = generator.generate(corpus)

        assert.strictEqual(Array.isArray(model.corpus), true)
        assert.strictEqual(model.documentVectors.length, 2)
    })
})
