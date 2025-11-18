/**
 * Tests for App.js
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import test, { suite } from 'node:test'
import assert from 'node:assert'
import { App } from '../../src/App.js'

// Mock database factory
const createMockDb = () => {
    return {
        prepare: () => ({
            get: () => ({ 'COUNT(*)': 5 }),
            all: () => [],
            run: () => ({ changes: 1 }),
        }),
        close: () => {},
        exec: () => {},
    }
}

// Mock file system
const createMockFs = (fileExists = true) => {
    return {
        existsSync: () => fileExists,
        readFileSync: () => '{}',
        writeFileSync: () => {},
    }
}

// Mock readline interface
const createMockReadline = (responses = []) => {
    let callCount = 0
    return {
        question: async () => {
            if (callCount >= responses.length) return 'exit'
            return responses[callCount++]
        },
        close: () => {},
    }
}

suite('App constructor', () => {
    test('initializes with correct properties', () => {
        const dbPath = '/test/db.db'
        const mockFs = createMockFs()
        const app = new App({ dbPath, fsModule: mockFs })

        assert.strictEqual(app.dbPath, dbPath)
        assert.strictEqual(app.db, null)
    })
})

suite('App.init()', () => {
    test('throws error if database file does not exist', () => {
        const mockFs = createMockFs(false)
        const app = new App({ dbPath: '/nonexistent/db.db', fsModule: mockFs })

        assert.throws(() => app.init(), /Database file '.+' not found\./)
    })

    test('succeeds when database file exists', () => {
        const mockDb = createMockDb()
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        assert.strictEqual(app.db, mockDb)
    })

    test('uses custom dbFactory', () => {
        let factoryCalled = false
        const mockDb = createMockDb()
        const customFactory = () => {
            factoryCalled = true
            return mockDb
        }
        const mockFs = createMockFs(true)

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory: customFactory,
            fsModule: mockFs,
        })

        app.init()
        assert.strictEqual(factoryCalled, true)
    })
})
test('App.runSingleQuery() throws if database not initialized', async () => {
    const mockFs = createMockFs()
    const app = new App({ dbPath: '/test/db.db', fsModule: mockFs })

    await assert.rejects(() => app.runSingleQuery('test query'), /Database not initialized/)
})

suite('App.close()', () => {
    test('closes database connection', () => {
        let closeCalled = false
        const mockDb = {
            ...createMockDb(),
            close: () => {
                closeCalled = true
            },
        }
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        app.close()

        assert.strictEqual(closeCalled, true)
        assert.strictEqual(app.db, null)
    })

    test('sets db to null after closing', () => {
        const mockDb = createMockDb()
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        assert.notStrictEqual(app.db, null)

        app.close()
        assert.strictEqual(app.db, null)
    })
    test('is idempotent', () => {
        const mockDb = createMockDb()
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        app.close()
        app.close() // Should not throw

        assert.strictEqual(app.db, null)
    })
})
suite('App.runInteractive()', () => {
    test('throws if database not initialized', async () => {
        const mockFs = createMockFs()
        const mockReadline = createMockReadline()

        const app = new App({
            dbPath: '/test/db.db',
            fsModule: mockFs,
        })

        await assert.rejects(
            () => app.runInteractive({ question: mockReadline.question }),
            /Database not initialized/
        )
    })

    test('uses provided readline interface', async () => {
        const mockDb = createMockDb()
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        let questionCalled = false
        const mockReadline = {
            question: async () => {
                questionCalled = true
                return 'exit'
            },
            close: () => {},
        }

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        await app.runInteractive(mockReadline)

        assert.strictEqual(questionCalled, true)
    })

    test('ignores empty input', async () => {
        const mockDb = createMockDb()
        const mockFs = createMockFs(true)
        const dbFactory = () => mockDb

        let iterations = 0
        const mockReadline = {
            question: async () => {
                iterations++
                if (iterations === 1) return '   ' // whitespace only
                if (iterations === 2) return '' // empty
                return 'exit'
            },
            close: () => {},
        }

        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
            fsModule: mockFs,
        })

        app.init()
        await app.runInteractive(mockReadline)

        assert.strictEqual(iterations, 3)
    })
})
test('App.printInstructions() outputs welcome message', () => {
    let output = ''
    const originalLog = console.log
    console.log = (msg) => {
        output += msg
    }

    try {
        const app = new App({ dbPath: '/test/db.db' })
        app.printInstructions()

        assert.match(output, /Welcome to the Hybrid Vulnerability Query System/)
        assert.match(output, /Example Queries/)
    } finally {
        console.log = originalLog
    }
})

suite('App uses defaults', () => {
    test('fs module when not provided', () => {
        const dbFactory = () => createMockDb()
        const app = new App({
            dbPath: '/test/db.db',
            dbFactory,
        })

        // Should use fs by default, so fs.existsSync should be callable
        assert.strictEqual(typeof app.fs.existsSync, 'function')
    })

    test('dbFactory when not provided', async () => {
        const mockFs = {
            existsSync: () => true,
        }

        // This test verifies the default dbFactory is set, even if we can't test Database directly
        const app = new App({
            dbPath: '/test/db.db',
            fsModule: mockFs,
        })

        assert.strictEqual(typeof app.dbFactory, 'function')
    })
})
