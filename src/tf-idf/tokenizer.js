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
    const cleanText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()[\]"'@?<>]/g, '')
    // Split by whitespace and filter out empty strings
    return cleanText.split(/\s+/).filter((token) => token.length > 0)
}
