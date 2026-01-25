/**
 * Tests for tokenizer.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import { tokenize } from '../../src/tf-idf/tokenizer.js'

suite('tokenizer', () => {
    suite('Basic Tokenization', () => {
        test('converts text to lowercase', () => {
            const result = tokenize('HELLO WORLD')
            assert.deepStrictEqual(result, ['hello', 'world'])
        })

        test('splits by whitespace', () => {
            const result = tokenize('hello world foo bar')
            assert.deepStrictEqual(result, ['hello', 'world', 'foo', 'bar'])
        })

        test('handles multiple spaces', () => {
            const result = tokenize('hello    world')
            assert.deepStrictEqual(result, ['hello', 'world'])
        })

        test('handles tabs and newlines', () => {
            const result = tokenize('hello\tworld\ntest')
            assert.deepStrictEqual(result, ['hello', 'world', 'test'])
        })

        test('preserves alphanumeric characters', () => {
            const result = tokenize('test123 abc456')
            assert.deepStrictEqual(result, ['test123', 'abc456'])
        })

        test('is case-insensitive', () => {
            const result1 = tokenize('HELLO')
            const result2 = tokenize('hello')
            const result3 = tokenize('HeLlo')
            assert.deepStrictEqual(result1, result2)
            assert.deepStrictEqual(result2, result3)
        })
    })

    suite('Punctuation and Stop Words', () => {
        test('removes common punctuation', () => {
            const result = tokenize('hello, world!')
            assert.deepStrictEqual(result, ['hello', 'world'])
        })

        test('removes common punctuation marks and stop words', () => {
            const result = tokenize("What is this? It's great!")
            assert.deepStrictEqual(result, ['s', 'great'])
        })

        test('replaces special characters with space', () => {
            const result = tokenize('hello@world test$value')
            assert.deepStrictEqual(result, ['hello', 'world', 'test', 'value'])
        })

        test('handles dots and slashes', () => {
            const result = tokenize('path/to/file.txt')
            assert.deepStrictEqual(result, ['path', 'file.txt'])
        })

        test('handles dashes and underscores', () => {
            const result = tokenize('my-package_name')
            assert.deepStrictEqual(result, ['package', 'name'])
        })

        test('handles parentheses and brackets', () => {
            const result = tokenize('example (with) [brackets]')
            assert.deepStrictEqual(result, ['example', 'bracket'])
        })

        test('handles curly braces', () => {
            const result = tokenize('data{value}here')
            assert.deepStrictEqual(result, ['data', 'value'])
        })

        test('handles mixed case and punctuation', () => {
            const result = tokenize('Hello, World! How are you?')
            assert.deepStrictEqual(result, ['hello', 'world'])
        })

        test('handles quotes', () => {
            const result = tokenize('"hello" world')
            assert.deepStrictEqual(result, ['hello', 'world'])
        })
    })

    suite('Stemming', () => {
        test('stems words ending in "ing"', () => {
            const result = tokenize('running jumping')
            assert.deepStrictEqual(result, ['run', 'jump'])
        })

        test('stems words ending in "ies"', () => {
            const result = tokenize('studies bunnies')
            assert.deepStrictEqual(result, ['study', 'bunny'])
        })

        test('stems words ending in "s" but not "ss"', () => {
            const result = tokenize('cats dogs process')
            assert.deepStrictEqual(result, ['cat', 'dog', 'process'])
        })

        test('does not stem short words', () => {
            const result = tokenize('bus has gas')
            assert.deepStrictEqual(result, ['bus', 'gas'])
        })
    })

    suite('Options', () => {
        test('respects stemming=false option', () => {
            const result = tokenize('running tests', { stemming: false })
            assert.deepStrictEqual(result, ['running', 'tests'])
        })

        test('supports custom stop words (Russian)', () => {
            const russianStopWords = new Set([
                'и',
                'в',
                'во',
                'не',
                'что',
                'он',
                'на',
                'я',
                'с',
                'со',
            ])
            const text = 'я и мой друг пошли в кино'
            const result = tokenize(text, { stopWords: russianStopWords, stemming: false })
            assert.deepStrictEqual(result, ['мой', 'друг', 'пошли', 'кино'])
        })
    })

    suite('Edge Cases', () => {
        test('filters out empty strings', () => {
            const result = tokenize('   ')
            assert.deepStrictEqual(result, [])
        })

        test('returns empty array for empty string', () => {
            const result = tokenize('')
            assert.deepStrictEqual(result, [])
        })

        test('handles edge case: only punctuation', () => {
            const result = tokenize('!@#$%^&*()')
            assert.deepStrictEqual(result, [])
        })

        test('handles unicode letters (preserves them)', () => {
            const result = tokenize('café naïve')
            assert.deepStrictEqual(result, ['café', 'naïve'])
        })

        test('handles Cyrillic (preserves them)', () => {
            const result = tokenize('Добрый день, как дела?')
            assert.deepStrictEqual(result, ['добрый', 'день', 'как', 'дела'])
        })

        test('throws TypeError for non-string input', () => {
            assert.throws(() => tokenize(123), TypeError)
            assert.throws(() => tokenize(null), TypeError)
            assert.throws(() => tokenize(undefined), TypeError)
            assert.throws(() => tokenize({}), TypeError)
            assert.throws(() => tokenize([]), TypeError)
        })
    })

    suite('Real-world Examples', () => {
        test('handles package name query', () => {
            const result = tokenize('What vulnerabilities does express@5.0.0 have?')
            assert.deepStrictEqual(result, ['vulnerability', 'express', '5.0.0'])
        })

        test('handles version comparisons', () => {
            const result = tokenize('Version > 1.2.3 and < 2.0.0')
            assert.deepStrictEqual(result, ['version', '1.2.3', '2.0.0'])
        })
    })
})
