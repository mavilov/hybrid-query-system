/**
 * Tests for tokenizer.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import { tokenize } from '../../src/tf-idf/tokenizer.js'

suite('tokenizer', () => {
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

    test('removes punctuation', () => {
        const result = tokenize('hello, world!')
        assert.deepStrictEqual(result, ['hello', 'world'])
    })

    test('removes common punctuation marks and stop words', () => {
        const result = tokenize("What is this? It's great!")
        // 'what' (kept), 'is' (stop), 'this' -> 'thi' (stem), 'it's' -> 'it' (stem), 'great' (kept)
        assert.deepStrictEqual(result, ['what', 'thi', 'it', 'great'])
    })

    test('replaces special characters with space', () => {
        const result = tokenize('hello@world test$value')
        assert.deepStrictEqual(result, ['hello', 'world', 'test', 'value'])
    })

    test('handles dots and slashes', () => {
        const result = tokenize('path/to/file.txt')
        // 'path', 'to' (stop), 'file', 'txt'
        assert.deepStrictEqual(result, ['path', 'file', 'txt'])
    })

    test('handles dashes and underscores', () => {
        const result = tokenize('my-package_name')
        assert.deepStrictEqual(result, ['my', 'package', 'name'])
    })

    test('handles parentheses and brackets', () => {
        const result = tokenize('example (with) [brackets]')
        // 'example', 'with' (stop), 'brackets' -> 'bracket' (stem)
        assert.deepStrictEqual(result, ['example', 'bracket'])
    })

    test('handles curly braces', () => {
        const result = tokenize('data{value}here')
        assert.deepStrictEqual(result, ['data', 'value', 'here'])
    })

    test('filters out empty strings', () => {
        const result = tokenize('   ')
        assert.deepStrictEqual(result, [])
    })

    test('returns empty array for empty string', () => {
        const result = tokenize('')
        assert.deepStrictEqual(result, [])
    })

    test('handles tabs and newlines', () => {
        const result = tokenize('hello\tworld\ntest')
        assert.deepStrictEqual(result, ['hello', 'world', 'test'])
    })

    test('preserves alphanumeric characters', () => {
        const result = tokenize('test123 abc456')
        assert.deepStrictEqual(result, ['test123', 'abc456'])
    })

    test('handles mixed case and punctuation', () => {
        const result = tokenize('Hello, World! How are you?')
        assert.deepStrictEqual(result, ['hello', 'world', 'how', 'are', 'you'])
    })

    test('handles real-world example: package name query', () => {
        const result = tokenize('What vulnerabilities does express@5.0.0 have?')
        // 'what', 'vulnerabilities'->'vulnerability', 'does'->'doe', 'express', '5', '0', '0', 'have'
        assert.deepStrictEqual(result, [
            'what',
            'vulnerability',
            'doe',
            'express',
            '5',
            '0',
            '0',
            'have',
        ])
    })

    test('handles real-world example: less and more chars', () => {
        const result = tokenize('Version > 1.2.3 and < 2.0.0')
        // 'version', '1', '2', '3', 'and'(stop), '2', '0', '0'
        assert.deepStrictEqual(result, ['version', '1', '2', '3', '2', '0', '0'])
    })

    test('handles quotes', () => {
        const result = tokenize('"hello" world')
        assert.deepStrictEqual(result, ['hello', 'world'])
    })

    test('handles backticks', () => {
        const result = tokenize('`const` variable')
        assert.deepStrictEqual(result, ['const', 'variable'])
    })

    test('handles tilde', () => {
        const result = tokenize('~important')
        assert.deepStrictEqual(result, ['important'])
    })

    test('handles percent signs', () => {
        const result = tokenize('100% secure')
        assert.deepStrictEqual(result, ['100', 'secure'])
    })

    test('handles ampersand', () => {
        const result = tokenize('this & that')
        assert.deepStrictEqual(result, ['thi', 'that'])
    })

    test('handles semicolons', () => {
        const result = tokenize('first; second')
        assert.deepStrictEqual(result, ['first', 'second'])
    })

    test('handles colon', () => {
        const result = tokenize('key: value')
        assert.deepStrictEqual(result, ['key', 'value'])
    })

    test('handles equals sign', () => {
        const result = tokenize('x=y')
        assert.deepStrictEqual(result, ['x', 'y'])
    })

    test('is case-insensitive', () => {
        const result1 = tokenize('HELLO')
        const result2 = tokenize('hello')
        const result3 = tokenize('HeLlo')
        assert.deepStrictEqual(result1, result2)
        assert.deepStrictEqual(result2, result3)
    })

    test('handles edge case: only punctuation', () => {
        const result = tokenize('!@#$%^&*()')
        assert.deepStrictEqual(result, [])
    })

    test('handles unicode letters (preserves them)', () => {
        const result = tokenize('café naïve')
        assert.deepStrictEqual(result, ['café', 'naïve'])
    })

    test('throws TypeError for non-string input', () => {
        assert.throws(() => {
            tokenize(123)
        }, TypeError)

        assert.throws(() => {
            tokenize(null)
        }, TypeError)

        assert.throws(() => {
            tokenize(undefined)
        }, TypeError)

        assert.throws(() => {
            tokenize({})
        }, TypeError)

        assert.throws(() => {
            tokenize([])
        }, TypeError)
    })
    test('handles Cyrillic (preserves them)', () => {
        const result = tokenize('Добрый день, как дела?')
        assert.deepStrictEqual(result, ['добрый', 'день', 'как', 'дела'])
    })
})
