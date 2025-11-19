/**
 * Implements a simple tokenizer for text preprocessing.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

/**
 * Simple, non-aggressive tokenizer. Converts text to lowercase and splits by non-word characters.
 * Preprocessing does lowercasing and removes non-word characters except spaces
 *
 * @param {string} the input text to tokenize
 * @returns {string[]} An array of tokens (words).
 */
export const tokenize = (text) => {
    if (typeof text !== 'string') {
        throw new TypeError('Input must be a string')
    }

    // 1. Lowercase
    let processed = text.toLowerCase()

    // 2. Replace punctuation with SPACE (preserves word boundaries)
    // Use Unicode property escapes to match anything that is NOT a letter (\p{L}), number (\p{N}), or whitespace (\s).
    // This preserves accents, Cyrillic, etc., while replacing punctuation and symbols (including _) with space.
    processed = processed.replace(/[^\p{L}\p{N}\s]+/gu, ' ')

    // 3. Split by whitespace
    const tokens = processed.split(/\s+/).filter((t) => t.length > 0)

    // 4. Stop words (basic list)
    const stopWords = new Set([
        'the',
        'is',
        'at',
        'of',
        'on',
        'and',
        'a',
        'an',
        'to',
        'in',
        'for',
        'with',
    ])

    return (
        tokens
            .filter((t) => !stopWords.has(t))
            // 5. Simple stemming (optional but helpful)
            .map((t) => {
                if (t.endsWith('ing')) return t.slice(0, -3)
                if (t.endsWith('ies')) return t.slice(0, -3) + 'y'
                if (t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1)
                return t
            })
            .filter((t) => t.length > 0) // Filter empty strings after stemming (e.g. "s" -> "")
    )
}
