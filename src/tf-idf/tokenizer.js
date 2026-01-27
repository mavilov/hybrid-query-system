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
    'a',
    'about',
    'above',
    'after',
    'again',
    'against',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    "aren't",
    'as',
    'at',
    'be',
    'because',
    'been',
    'before',
    'being',
    'below',
    'between',
    'both',
    'but',
    'by',
    "can't",
    'cannot',
    'could',
    "couldn't",
    'did',
    "didn't",
    'do',
    'does',
    "doesn't",
    'doing',
    "don't",
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
    'further',
    'had',
    "hadn't",
    'has',
    "hasn't",
    'have',
    "haven't",
    'having',
    'he',
    "he'd",
    "he'll",
    "he's",
    'her',
    'here',
    "here's",
    'hers',
    'herself',
    'him',
    'himself',
    'his',
    'how',
    "how's",
    'i',
    "i'd",
    "i'll",
    "i'm",
    "i've",
    'if',
    'in',
    'into',
    'is',
    "isn't",
    'it',
    "it's",
    'its',
    'itself',
    "let's",
    'me',
    'more',
    'most',
    "mustn't",
    'my',
    'myself',
    'no',
    'nor',
    'not',
    'of',
    'off',
    'on',
    'once',
    'only',
    'or',
    'other',
    'ought',
    'our',
    'ours',
    'ourselves',
    'out',
    'over',
    'own',
    'same',
    "shan't",
    'she',
    "she'd",
    "she'll",
    "she's",
    'should',
    "shouldn't",
    'so',
    'some',
    'such',
    'than',
    'that',
    "that's",
    'the',
    'their',
    'theirs',
    'them',
    'themselves',
    'then',
    'there',
    "there's",
    'these',
    'they',
    "they'd",
    "they'll",
    "they're",
    "they've",
    'this',
    'those',
    'through',
    'to',
    'too',
    'under',
    'until',
    'up',
    'very',
    'was',
    "wasn't",
    'we',
    "we'd",
    "we'll",
    "we're",
    "we've",
    'were',
    "weren't",
    'what',
    "what's",
    'when',
    "when's",
    'where',
    "where's",
    'which',
    'while',
    'who',
    "who's",
    'whom',
    'why',
    "why's",
    'with',
    "won't",
    'would',
    "wouldn't",
    'you',
    "you'd",
    "you'll",
    "you're",
    "you've",
    'your',
    'yours',
    'yourself',
    'yourselves',
])

/**
 * Simple, non-aggressive stemmer.
 * Only stems tokens that are 4 chars or more to avoid over-stemming short words like "gas" or "bus"
 * @param {string} token - The token to stem.
 * @returns {string} The stemmed token.
 */
const _stem = (token) => {
    if (token.length < 4) {
        return token
    }

    if (token.endsWith('ing')) {
        const stem = token.slice(0, -3)
        if (
            stem.length > 1 &&
            stem[stem.length - 1] === stem[stem.length - 2] &&
            stem[stem.length - 1] !== 's'
        ) {
            return stem.slice(0, -1)
        }
        return stem
    } else if (token.endsWith('ies')) {
        return token.slice(0, -3) + 'y'
    } else if (token.endsWith('s') && !token.endsWith('ss')) {
        return token.slice(0, -1)
    }

    return token
}

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

    // 2. Replace punctuation with SPACE (preserves word boundaries and dots)
    processed = processed.replace(/[^\p{L}\p{N}\s.]+/gu, ' ')

    // 3. Split by whitespace
    const rawTokens = processed.split(/\s+/)
    const results = []

    for (let t of rawTokens) {
        // remove leading/trailing dots
        t = t.replace(/(^\.+|\.+$)/g, '')

        // Skip empty strings
        if (t.length === 0) continue

        // Skip stop words
        if (stopWords.has(t)) continue

        let token = useStemming ? _stem(t) : t

        results.push(token)
    }

    return results
}
