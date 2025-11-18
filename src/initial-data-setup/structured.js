/**
 *  Static setup structured Data (Packages and Vulnerabilities)
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

export const SQL_SCHEMA = `
-- Table of known software packages
CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    repository TEXT TEXT CHECK( repository IN ('npm','maven','pypi', 'rpm') ) NOT NULL
);

-- Table of specific vulnerability records
CREATE TABLE IF NOT EXISTS vulnerabilities (
    vuln_id INTEGER PRIMARY KEY,
    package_id INTEGER,
    version_start TEXT, -- Version where vulnerability begins (inclusive)
    version_end TEXT,   -- Version where vulnerability ends (inclusive)
    severity TEXT CHECK( severity IN ('CRITICAL','HIGH','MEDIUM','LOW') ),
    cve_id TEXT,        -- Unique vulnerability identifier
    summary TEXT,       -- Short description
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
);
`

export const SQL_DATA = [
    {
        table: 'packages',
        data: [
            [1, 'express', 'npm'],
            [2, 'lodash', 'npm'],
            [3, 'jackson-databind', 'maven'],
            [4, 'log4j', 'maven'],
            [5, 'axios', 'npm'],
            [6, 'validator-node', 'npm'],
        ],
    },
    {
        table: 'vulnerabilities',
        data: [
            // express vulnerability: affecting specific beta version
            [
                101,
                1,
                '5.0.0-beta.2',
                '5.0.0-beta.2',
                'MEDIUM',
                'CVE-2024-001',
                'Cross-site Scripting/Open Redirect',
            ],
            // lodash vulnerability: affecting a range
            [102, 2, '4.17.0', '4.17.20', 'HIGH', 'CVE-2023-1001', 'Prototype Pollution'],
            // jackson-databind vulnerability: affecting a range
            [103, 3, '2.0.0', '2.15.0', 'CRITICAL', 'CVE-2023-9999', 'Deserialization Flaw'],
            // log4j vulnerability: affecting a range
            [
                104,
                4,
                '2.0-beta9',
                '2.15.0',
                'CRITICAL',
                'CVE-2021-44228',
                'Zero-day vulnerability allowing remote code execution',
            ],
            // axios vulnerabilities: affecting a range
            [105, 5, '0.21.0', '0.21.1', 'HIGH', 'CVE-2023-2001', 'Server-Side Request Forgery'],
            [106, 5, '0.18.0', '0.21.0', 'MEDIUM', 'CVE-2022-3001', 'Denial of Service'],
            [107, 5, '0.19.0', '0.19.2', 'LOW', 'CVE-2021-1234', 'Information Exposure'],
            [
                108,
                5,
                '1.11.0',
                '1.11.2',
                'HIGH',
                'CVE-2024-3002',
                'Allocation of Resources Without Limits or Throttling',
            ],
            // validator-node vulnerability: malicious package
            [110, 6, null, null, 'CRITICAL', 'SNYK-JS-VALIDATORNODE-13961690', 'Malicious Package'],
        ],
    },
]
