/**
 *  Initial setup. This needs to be executed once to set up the SQL database and generate the TF-IDF model file.
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import Database from 'better-sqlite3'
import * as fs from 'node:fs'
import { SQL_SCHEMA, SQL_DATA } from './structured.js'
import { CORPUS } from './unstructured.js'
import { SQLITE_DB_PATH, TFIDF_MODEL_PATH } from '../config.js'
import { ModelGenerator } from '../tf-idf/ModelGenerator.js'

const insertAllRows = (db, table, columns, data) => {
    const values = data[0].map(() => '?').join(', ')
    const insert = db.prepare(`INSERT INTO ${table} ${columns} VALUES (${values})`)

    data.forEach((row) => {
        try {
            insert.run(...row)
        } catch (e) {
            console.error(`Error inserting row into ${table}: ${e.message}`)
        }
    })
}

const insertData = (db) => {
    SQL_DATA.forEach(({ table, data }) => {
        console.log(`Inserting data into ${table}...`)
        let columns

        if (table === 'packages') {
            columns = '(package_id, name, repository)'
        } else if (table === 'vulnerabilities') {
            columns = '(vuln_id, package_id, version_start, version_end, severity, cve_id, summary)'
        } else {
            console.error(`Unknown table: ${table}`)
            return
        }

        insertAllRows(db, table, columns, data)
    })
    console.log('Data insertion complete.')
}

const _setupDatabase = (db) => {
    db.exec(SQL_SCHEMA)
    console.log('Schema created/verified.')

    // Check if data already exists and skip insertion if so. Database file can be deleted and recreated if needed.
    const packageCount = db.prepare('SELECT COUNT(*) FROM packages').get()['COUNT(*)']

    if (packageCount !== 0) {
        console.log('Database already contains data. Skipping insertion.')
        return
    }
    insertData(db)
}

const saveTfIdfModel = (model) => {
    const modelJson = JSON.stringify(model, null, 2)
    fs.writeFileSync(TFIDF_MODEL_PATH, modelJson, 'utf-8')
    console.log('TF-IDF model generated and saved successfully.')
    console.log(`Vocabulary size: ${Object.keys(model.vocabulary).length}`)
    console.log(`Corpus size: ${model.corpus.length}`)
}

const setupStructuredData = () => {
    console.log('Setting up SQLite Database...')
    const db = new Database(SQLITE_DB_PATH)
    _setupDatabase(db)
    db.close()
    console.log(`SQLite Database setup complete. Database file: ${SQLITE_DB_PATH}\n`)
}

const setupUnstructuredData = () => {
    console.log(`Generating and saving TF-IDF Model...`)
    const modelGenerator = new ModelGenerator()
    const model = modelGenerator.generate(CORPUS)
    saveTfIdfModel(model)
    console.log(`TF-IDF Model saved successfully. Model file: ${TFIDF_MODEL_PATH}\n`)
}

const printInstructions = () => {
    const instruction = `Setup Complete! The system is ready to run.
Next step: try \`npm run start\` to start the query router.
Or run a single query: \`node src/start.js "What vulnerabilities does the package express have?"\``

    console.log(instruction)
}

const main = () => {
    setupStructuredData()
    setupUnstructuredData()
    printInstructions()
}

main()
