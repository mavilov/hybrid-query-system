/**
 *  Core application: runs queries and interactive sessions against the hybrid sources.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { runHybridQuery } from './runHybridQuery.js'
import * as fs from 'node:fs'
import Database from 'better-sqlite3'

export class App {
    constructor({
        dbPath,
        dbFactory = (p, opts) => new Database(p, opts),
        fsModule = fs,
    }) {
        this.dbPath = dbPath
        this.dbFactory = dbFactory
        this.fs = fsModule
        this.db = null
    }

    init() {
        if (!this.fs.existsSync(this.dbPath)) {
            throw new Error(`Database file '${this.dbPath}' not found.`)
        }
        this.db = this.dbFactory(this.dbPath, {
            verbose: (msg) => console.log(`[SQLITE]: ${msg}`),
        })
    }

    async runSingleQuery(query) {
        if (!this.db) throw new Error('Database not initialized')
        await runHybridQuery(this.db, query)
        return 0
    }

    async runInteractive(
        io = { input: process.stdin, output: process.stdout, question: null }
    ) {
        if (!this.db) throw new Error('Database not initialized')

        let rl
        if (io.question) {
            rl = io
        } else {
            const { createInterface } = await import('node:readline/promises')
            rl = createInterface({
                input: io.input ?? process.stdin,
                output: io.output ?? process.stdout,
            })
        }

        try {
            this.printInstructions()
            while (true) {
                const q = await rl.question(
                    '\nEnter a question (or type "exit"): '
                )
                if (q.trim().toLowerCase() === 'exit') break
                if (q.trim()) await runHybridQuery(this.db, q.trim())
            }
        } finally {
            rl.close?.()
        }
    }
    printInstructions() {
        const instructions = `
Welcome to the Hybrid Vulnerability Query System.
Example Queries:
  VECTOR: What are the best practices for securing Maven dependencies?
  SQL: What vulnerabilities does the package lodash have?
  HYBRID: Give me the detailed advisory for express@5.0.0-beta.2
`
        console.log(instructions)
    }

    close() {
        this.db?.close()
        this.db = null
    }
}
