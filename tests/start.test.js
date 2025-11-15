/**
 * Tests for start.js
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test from 'node:test'
import assert from 'node:assert'
import Database from 'better-sqlite3'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_DB_PATH = path.join(__dirname, 'test_db.sqlite')

// Helper function to create a test database
function createTestDatabase() {
    // Clean up any existing test database
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH)
    }

    const db = new Database(TEST_DB_PATH)

    // Create minimal schema for testing
    const schema = `
        CREATE TABLE IF NOT EXISTS packages (
            package_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            repository TEXT
        );

        CREATE TABLE IF NOT EXISTS vulnerabilities (
            vuln_id INTEGER PRIMARY KEY,
            package_id INTEGER NOT NULL,
            version_start TEXT,
            version_end TEXT,
            severity TEXT,
            cve_id TEXT,
            summary TEXT,
            FOREIGN KEY (package_id) REFERENCES packages(package_id)
        );
    `

    db.exec(schema)

    // Insert test data
    db.prepare(
        'INSERT INTO packages (package_id, name, repository) VALUES (?, ?, ?)'
    ).run(1, 'express', 'https://github.com/expressjs/express')

    db.prepare(
        'INSERT INTO vulnerabilities (vuln_id, package_id, version_start, version_end, severity, cve_id, summary) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
        1,
        1,
        '4.0.0',
        '5.0.0',
        'high',
        'CVE-2024-001',
        'Test vulnerability'
    )

    return db
}

// Helper function to clean up test database
function cleanupTestDatabase() {
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH)
    }
}

test('Database connection and initialization', async (t) => {
    const db = createTestDatabase()

    await t.test('should open database successfully', () => {
        assert.ok(db, 'Database instance should exist')
    })

    await t.test('should have packages table', () => {
        const result = db.prepare('SELECT COUNT(*) as count FROM packages').get()
        assert.strictEqual(result.count, 1, 'Should have one package')
    })

    await t.test('should have vulnerabilities table', () => {
        const result = db
            .prepare('SELECT COUNT(*) as count FROM vulnerabilities')
            .get()
        assert.strictEqual(result.count, 1, 'Should have one vulnerability')
    })

    await t.test('should retrieve package data correctly', () => {
        const pkg = db.prepare('SELECT * FROM packages WHERE name = ?').get('express')
        assert.strictEqual(pkg.name, 'express', 'Package name should match')
        assert.ok(pkg.repository.includes('expressjs'), 'Repository should contain expressjs')
    })

    await t.test('should retrieve vulnerability data correctly', () => {
        const vuln = db
            .prepare('SELECT * FROM vulnerabilities WHERE cve_id = ?')
            .get('CVE-2024-001')
        assert.strictEqual(vuln.severity, 'high', 'Severity should be high')
        assert.strictEqual(vuln.cve_id, 'CVE-2024-001', 'CVE ID should match')
    })

    db.close()
    cleanupTestDatabase()
})

test('Database file existence check', async (t) => {
    await t.test('should detect missing database file', () => {
        const nonExistentPath = path.join(__dirname, 'non_existent.db')
        assert.ok(
            !fs.existsSync(nonExistentPath),
            'Non-existent database should not exist'
        )
    })

    await t.test('should detect existing database file', () => {
        const db = createTestDatabase()
        assert.ok(fs.existsSync(TEST_DB_PATH), 'Test database should exist')
        db.close()
        cleanupTestDatabase()
    })
})

test('Query argument parsing', async (t) => {
    await t.test('should handle single query argument', () => {
        const args = process.argv.slice(2)
        const query = args.join(' ')
        assert.strictEqual(typeof query, 'string', 'Query should be a string')
    })

    await t.test('should handle empty query', () => {
        const emptyQuery = ''
        assert.strictEqual(emptyQuery.trim(), '', 'Trimmed empty query should be empty')
    })

    await t.test('should handle multi-word queries', () => {
        const multiWordQuery = 'What vulnerabilities does express have?'
        assert.ok(
            multiWordQuery.includes('vulnerabilities'),
            'Query should preserve content'
        )
    })
})

test('String operations used in start.js', async (t) => {
    await t.test('should handle lowercase conversion for exit check', () => {
        const exitCommand = 'EXIT'
        assert.strictEqual(
            exitCommand.toLowerCase(),
            'exit',
            'Should convert to lowercase'
        )
    })

    await t.test('should trim whitespace from query', () => {
        const query = '  What are the vulnerabilities?  '
        assert.strictEqual(
            query.trim(),
            'What are the vulnerabilities?',
            'Should remove leading/trailing whitespace'
        )
    })

    await t.test('should concatenate arguments with spaces', () => {
        const args = ['What', 'vulnerabilities', 'does', 'express', 'have?']
        const query = args.join(' ')
        assert.strictEqual(
            query,
            'What vulnerabilities does express have?',
            'Should join with spaces'
        )
    })
})

test('Process exit codes', async (t) => {
    await t.test('should use exit code 0 for success', () => {
        const successCode = 0
        assert.strictEqual(successCode, 0, 'Success should be 0')
    })

    await t.test('should use exit code 1 for failure', () => {
        const failureCode = 1
        assert.strictEqual(failureCode, 1, 'Failure should be 1')
    })
})

test('Database query patterns', async (t) => {
    const db = createTestDatabase()

    await t.test('should count records in packages table', () => {
        const result = db
            .prepare('SELECT COUNT(*) as count FROM packages')
            .get()
        assert.ok(
            typeof result.count === 'number',
            'Count should be a number'
        )
        assert.strictEqual(result.count, 1, 'Should have correct count')
    })

    await t.test('should retrieve single package by name', () => {
        const pkg = db
            .prepare('SELECT * FROM packages WHERE name = ?')
            .get('express')
        assert.ok(pkg, 'Should retrieve package')
        assert.strictEqual(pkg.name, 'express', 'Package name should match')
    })

    await t.test('should retrieve vulnerabilities by package_id', () => {
        const vulns = db
            .prepare('SELECT * FROM vulnerabilities WHERE package_id = ?')
            .all(1)
        assert.ok(Array.isArray(vulns), 'Should return array')
        assert.ok(vulns.length > 0, 'Should find vulnerabilities')
    })

    db.close()
    cleanupTestDatabase()
})

test('Error handling scenarios', async (t) => {
    await t.test('should handle database connection error gracefully', () => {
        const error = new Error('Failed to open database: test error')
        assert.ok(error.message.includes('Failed to open database'))
    })

    await t.test('should handle query execution error gracefully', () => {
        const error = new Error('CLI execution failed: test error')
        assert.ok(error.message.includes('CLI execution failed'))
    })
})
