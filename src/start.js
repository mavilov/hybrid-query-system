/**
 *  Main entrypoint: handles user input and runs queries in either single-query or interactive mode.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import { SQLITE_DB_PATH } from './config.js'
import { App } from './App.js'

async function main() {
    const app = new App({ dbPath: SQLITE_DB_PATH })
    try {
        app.init()
    } catch (e) {
        console.error(e.message)
        return process.exit(1)
    }

    const queryArg = process.argv.slice(2).join(' ')
    if (queryArg) {
        try {
            await app.runSingleQuery(queryArg)
            app.close()
            return process.exit(0)
        } catch (e) {
            console.error(`CLI execution failed: ${e.message}`)
            app.close()
            return process.exit(1)
        }
    }

    try {
        await app.runInteractive()
    } catch (e) {
        console.error(`Interactive session failed: ${e.message}`)
        return process.exit(1)
    } finally {
        app.close()
    }
}

main()
