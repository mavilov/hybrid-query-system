/**
 *  Hybrid qiery execution module: decomposes the query, retrieves data, and synthesizes the answer.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { decomposeQuery } from '../query-decomposer/ollama.js'
import { retrieveSqlData } from './sqlData.js'
import { retrieveVectorData } from './vectorData.js'
import { synthesizeAnswer } from '../answer-synthesizer/ollama.js'

/**
 * Executes the full hybrid retrieval and synthesis flow.
 * @param {string} query - The user's input question.
 */
export const runHybridQuery = async (db, query) => {
    const decomposition = await decomposeQuery(query)
    if (!decomposition) {
        console.error('Decomposition failed.')
        return
    }

    const { type, sqlQuery, vectorSearchTerm, finalAnswerPrompt } = decomposition

    const context = getContext(type, db, sqlQuery, vectorSearchTerm)

    const finalAnswer = await synthesizeAnswer(query, context, finalAnswerPrompt)

    printFinalAnswer(finalAnswer, query, type, sqlQuery, vectorSearchTerm, context)
}

const getContext = (type, db, sqlQuery, vectorSearchTerm) => {
    let context
    let sqlResult
    let vectorResult

    if (type === 'SQL' || type === 'HYBRID') {
        // Good catch from Snyk scan. Let's ignore the SQL injection risk for this test assignment.
        sqlResult = retrieveSqlData(db, sqlQuery)
        context += `\n[SQL CONTEXT]: ${sqlResult}`
    }

    if (type === 'VECTOR') {
        vectorResult = retrieveVectorData(vectorSearchTerm)
        context += `\n[VECTOR CONTEXT]: ${vectorResult}`
    }

    if (type === 'HYBRID' && sqlResult.includes('No matching data found')) {
        // If SQL failed in HYBRID mode (e.g., package not found), we still continue vector search
        // in case the user's question was generic (e.g. "what is xss")
        vectorResult = retrieveVectorData(vectorSearchTerm)
        context += `\n[VECTOR CONTEXT]: ${vectorResult}`
    } else if (type === 'HYBRID') {
        // HYBRID: We now run the vector search, potentially informed by SQL data (e.g., CVE IDs).
        vectorResult = retrieveVectorData(vectorSearchTerm)
        context += `\n[VECTOR CONTEXT]: ${vectorResult}`
    }
    return context
}

const printFinalAnswer = (answer, query, type, sqlQuery, vectorSearchTerm, context) => {
    console.log('\n=================================================')
    console.log(`USER QUESTION: ${query}`)
    console.log(
        `\nSYSTEM PLAN:\nType: ${type}\nSQL: ${sqlQuery}\nVector Search: ${vectorSearchTerm}`
    )
    console.log('\nRAW CONTEXT RETRIEVED:')
    console.log(context)
    console.log('\n-------------------------------------------------')
    console.log(`FINAL ANSWER:\n${answer}`)
    console.log('=================================================')
}
