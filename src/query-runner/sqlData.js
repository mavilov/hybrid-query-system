/**
 *  Data Retrieval Logic for Structured SQL Database
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

/**
 * Executes a SQL query against the structured database.
 * @param {string} sql - The SQL query to run.
 * @returns {string} The formatted results as a string.
 */
export const retrieveSqlData = (db, sql) => {
    console.log(`Executing SQL: ${sql}`)
    try {
        const statement = db.prepare(sql)

        if (isSelectQuery(sql)) {
            const rows = statement.all()
            if (rows.length === 0) {
                return 'No matching data found in the SQL database for this package.'
            }

            const formattedResult = formatResults(rows)

            return `SQL Results (Vulnerabilities): [${formattedResult}]`
        } else {
            const err = `SQL operation blocked (Non-SELECT query generated).`
            console.error(err)
            return err
        }
    } catch (e) {
        console.error(`SQL Error: ${e.message}`)
        return `SQL execution failed: ${e.message}`
    }
}

const isSelectQuery = (sql) => {
    return sql.trim().toUpperCase().startsWith('SELECT')
}

/**
 * Formats returned rows into a readable string.
 *
 * TODO: somehow better format results into a readable string
 *
 * @param {*} rows - The rows returned from the SQL query.
 * @returns {string} The formatted results as a string.
 */
const formatResults = (rows) =>
    rows
        .map(
            (row) =>
                `Package: ${row.name || 'N/A'} | Severity: ${row.severity || 'N/A'} | CVE: ${row.cve_id || 'N/A'} | Versions: ${row.version_start} to ${row.version_end} | Summary: ${row.summary}`
        )
        .join(' | ')
