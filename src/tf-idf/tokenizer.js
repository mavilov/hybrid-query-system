/**
 * Implements a simple tokenizer for text preprocessing.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

/**
 * @typedef {Object} TokenizerOptions
 * @property {boolean} [stemming=true] - Enable/disable simple stemming
 * @property {Set<string>} [stopWords] - Custom set of stop words
 */

/**
 * Standard stop words (expanded set)
 */
const DEFAULT_STOP_WORDS = new Set([
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
    'that',
    'this',
    'it',
    'as',
    'by',
    'are',
    'was',
    'be',
    'or',
    'from',
    'not',
])

/**
 * Simple, non-aggressive tokenizer. Converts text to lowercase and splits by non-word characters.
 * Preprocessing does lowercasing and removes non-word characters except spaces.
 * Now includes safer stemming and improved performance.
 *
 * @param {string} text - The input text to tokenize
 * @param {TokenizerOptions} [options] - Configuration options
 * @returns {string[]} An array of tokens (words).
 */
export const tokenize = (text, options = {}) => {
    if (typeof text !== 'string') {
        throw new TypeError('Input must be a string')
    }

    const useStemming = options.stemming ?? true
    const stopWords = options.stopWords || DEFAULT_STOP_WORDS

    // 1. Lowercase
    let processed = text.toLowerCase()

    // 2. Replace punctuation with SPACE (preserves word boundaries)
    // Use Unicode property escapes to match anything that is NOT a letter (\p{L}), number (\p{N}), or whitespace (\s).
    // This preserves accents, Cyrillic, etc., while replacing punctuation and symbols (including _) with space.
    processed = processed.replace(/[^\p{L}\p{N}\s]+/gu, ' ')

    // 3. Split by whitespace
    const rawTokens = processed.split(/\s+/)
    const results = []

    for (const t of rawTokens) {
        // Skip empty strings
        if (t.length === 0) continue

        // Skip stop words
        if (stopWords.has(t)) continue

        let token = t

        // 4. Safer Simple Stemming
        // Only stem words longer than 3 chars to avoid over-stemming short words like "gas" or "bus"
        if (useStemming && token.length > 3) {
            if (token.endsWith('ing')) {
                token = token.slice(0, -3)
            } else if (token.endsWith('ies')) {
                token = token.slice(0, -3) + 'y'
            } else if (token.endsWith('s') && !token.endsWith('ss')) {
                token = token.slice(0, -1)
            }
        }

        results.push(token)
    }

    return results
}
