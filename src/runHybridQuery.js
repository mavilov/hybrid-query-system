/**
 *  Hybrid qiery execution module: decomposes the query, retrieves data, and synthesizes the answer.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { decomposeQuery } from './query_decomposer.js'
import { retrieveSqlData } from './retrieveSqlData.js'
import { retrieveVectorData } from './retrieveVectorData.js'
import { synthesizeAnswer } from './synthesizeAnswer.js'

/**
 * Executes the full hybrid retrieval and synthesis flow.
 * @param {string} query - The user's input question.
 */
export async function runHybridQuery(db, query) {
    const decomposition = await decomposeQuery(query)
    if (!decomposition) return

    const { type, sqlQuery, vectorSearchTerm, finalAnswerPrompt } =
        decomposition
    let context = ''
    let sqlResult = ''
    let vectorResult = ''

    // 2. Retrieval Step
    if (type === 'SQL' || type === 'HYBRID') {
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

    // 3. Synthesis Step
    const finalAnswer = await synthesizeAnswer(
        query,
        context,
        finalAnswerPrompt
    )

    _printFinalAnswer(
        finalAnswer,
        query,
        type,
        sqlQuery,
        vectorSearchTerm,
        context
    )
}

function _printFinalAnswer(
    answer,
    query,
    type,
    sqlQuery,
    vectorSearchTerm,
    context
) {
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
