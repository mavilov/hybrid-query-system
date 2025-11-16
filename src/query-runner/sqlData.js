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

            return `SQL Results (Vulnerabilities): \n${formattedResult}\n`
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
 * Formats returned rows into a readable table.
 *
 * @param {*} rows - The rows returned from the SQL query.
 * @returns {string} The formatted tabular results as a string.
 */
const formatResults = (rows) => {
    const headers = ['Package', 'Severity', 'CVE', 'Versions', 'Summary']

    // Prepare rows as arrays of string values, apply sensible defaults
    const rowValues = rows.map((row) => {
        const name = String(row.name ?? 'N/A')
        const severity = String(row.severity ?? 'N/A')
        const cve = String(row.cve_id ?? 'N/A')
        const versions = `${row.version_start ?? 'N/A'} to ${row.version_end ?? 'N/A'}`
        let summary = String(row.summary ?? 'N/A')
        const SUMMARY_MAX = 50
        if (summary.length > SUMMARY_MAX) {
            summary = summary.slice(0, SUMMARY_MAX - 1) + '…'
        }
        return [name, severity, cve, versions, summary]
    })

    // Compute column widths (take max of header and each column's values)
    const colWidths = headers.map((h, colIdx) => {
        const maxInColumn = rowValues.reduce((max, vals) => {
            return Math.max(max, String(vals[colIdx] ?? '').length)
        }, h.length)
        return Math.max(h.length, maxInColumn)
    })

    // Helper to pad a cell to column width
    const pad = (text, width) => String(text).padEnd(width)

    // Build table string
    const headerLine = headers.map((h, i) => pad(h, colWidths[i])).join(' | ')
    const dividerLine = colWidths.map((w) => '-'.repeat(w)).join('-+-')
    const dataLines = rowValues.map((vals) => vals.map((v, i) => pad(v, colWidths[i])).join(' | '))

    return [headerLine, dividerLine, ...dataLines].join('\n')
}
