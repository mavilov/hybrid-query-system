/**
 *  Main application: handles user input, and calls hybrid retrieval and answer synthesis.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import Database from 'better-sqlite3'
import * as readline from 'readline/promises'
import { stdin as input, stdout as output } from 'process'
import { SQLITE_DB_PATH } from './config.js'
import { runHybridQuery } from './runHybridQuery.js'
import * as fs from 'node:fs'

let db // Database instance initialized in cli()

async function _runSingleQueryAndExit(query) {
    try {
        await runHybridQuery(db, query)
        db.close()
        return process.exit(0) // Success
    } catch (e) {
        console.error(`CLI execution failed: ${e.message}`)
        db.close()
        return process.exit(1) // Failure
    }
}

function _printInstructions() {
    console.log('Welcome to the Hybrid Vulnerability Query System.')
    console.log('Example Queries:')
    console.log(
        '  1. VECTOR: What are the best practices for securing Maven dependencies?'
    )
    console.log('  2. SQL: What vulnerabilities does the package lodash have?')
    console.log(
        '  3. HYBRID: Give me the detailed advisory for the vulnerability in express@5.0.0-beta.2.'
    )
}

/**
 * CLI Interface
 * @returns {Promise<void>}
 */
async function cli() {
    if (!fs.existsSync(SQLITE_DB_PATH)) {
        console.error(
            `\nDatabase file '${SQLITE_DB_PATH}' not found. Please run 'npm install' then 'npm run setup' first.`
        )
        return process.exit(1) // Exit with error code
    }

    try {
        db = new Database(SQLITE_DB_PATH, {
            verbose: (msg) => console.log(`[SQLITE]: ${msg}`),
        })
    } catch (e) {
        console.error(`Failed to open database: ${e.message}`)
        return process.exit(1)
    }

    // Handle initial query from command line arguments
    const queryArgument = process.argv.slice(2).join(' ')

    if (queryArgument) {
        await _runSingleQueryAndExit(queryArgument)
    }

    _printInstructions()

    const rl = readline.createInterface({ input, output })

    while (true) {
        const query = await rl.question('\nEnter a question (or type "exit"): ')
        if (query.toLowerCase() === 'exit') {
            rl.close()
            break
        }
        if (query.trim()) {
            await runHybridQuery(query.trim())
        }
    }

    db.close()
}

cli()
