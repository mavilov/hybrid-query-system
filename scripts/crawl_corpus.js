import fs from 'fs'
import https from 'https'
import path from 'path'

const UNSTRUCTURED_FILE_PATH = path.resolve(process.cwd(), 'src/initial-data-setup/unstructured.js')
const STRUCTURED_FILE_PATH = path.resolve(process.cwd(), 'src/initial-data-setup/structured.js')

const CISA_URL =
    'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'

const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        }
        https
            .get(url, options, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    fetchUrl(res.headers.location).then(resolve).catch(reject)
                    return
                }
                let data = ''
                res.on('data', (chunk) => (data += chunk))
                res.on('end', () => resolve(data))
            })
            .on('error', reject)
    })
}

async function getCisaData() {
    console.log('Fetching CISA KEV data...')
    try {
        const jsonString = await fetchUrl(CISA_URL)
        const data = JSON.parse(jsonString)
        return data.vulnerabilities.slice(0, 100)
    } catch (e) {
        console.error('Error fetching CISA data:', e.message)
        return []
    }
}

async function getRussianDocuments() {
    console.log('Fetching Habr InfoSecurity Hub...')
    const documents = []
    for (let i = 1; i <= 5; i++) {
        const url = `https://habr.com/ru/hub/infosecurity/page${i}/`
        console.log(`  Fetching page ${i}...`)
        try {
            const html = await fetchUrl(url)
            const titleRegex =
                /<h2[^>]*>[\s\S]*?<a[^>]*class="[^"]*tm-title__link[^"]*"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<\/a>[\s\S]*?<\/h2>/gi
            let match
            while ((match = titleRegex.exec(html)) !== null) {
                const title = match[1].replace(/<[^>]+>/g, '').trim()
                if (title && !documents.includes(title)) documents.push(title)
            }
        } catch (e) {
            console.error(`  Error fetching Habr page ${i}:`, e.message)
        }
        await new Promise((r) => setTimeout(r, 600))
    }
    return documents.slice(0, 100)
}

async function updateUnstructured(russianDocs) {
    const content = `/**
 *  Static setup unstructured Text Corpus (Vulnerability Advisories and General Guidance)
 *  Updated by crawler at ${new Date().toISOString()}
 */

export const CORPUS = ${JSON.stringify(russianDocs, null, 4)};
`
    fs.writeFileSync(UNSTRUCTURED_FILE_PATH, content)
    console.log(`Updated ${UNSTRUCTURED_FILE_PATH}`)
}

async function updateStructured(cisaVulns) {
    // Seed data
    const seedPackages = [
        [1, 'express', 'npm'],
        [2, 'lodash', 'npm'],
        [3, 'jackson-databind', 'maven'],
        [4, 'log4j', 'maven'],
        [5, 'axios', 'npm'],
        [6, 'validator-node', 'npm'],
    ]

    const seedVulns = [
        [
            101,
            1,
            '5.0.0-beta.2',
            '5.0.0-beta.2',
            'MEDIUM',
            'CVE-2024-001',
            'Cross-site Scripting/Open Redirect',
        ],
        [102, 2, '4.17.0', '4.17.20', 'HIGH', 'CVE-2023-1001', 'Prototype Pollution'],
        [103, 3, '2.0.0', '2.15.0', 'CRITICAL', 'CVE-2023-9999', 'Deserialization Flaw'],
        [
            104,
            4,
            '2.0-beta9',
            '2.15.0',
            'CRITICAL',
            'CVE-2021-44228',
            'Zero-day vulnerability allowing remote code execution',
        ],
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
        [110, 6, null, null, 'CRITICAL', 'SNYK-JS-VALIDATORNODE-13961690', 'Malicious Package'],
    ]

    const packages = [...seedPackages]
    const vulnerabilities = [...seedVulns]

    const packageMap = new Map() // name -> id
    let nextPkgId = 1000
    let nextVulnId = 10000

    for (const v of cisaVulns) {
        const pkgName = `${v.vendorProject} ${v.product}`
        let pkgId
        if (packageMap.has(pkgName)) {
            pkgId = packageMap.get(pkgName)
        } else {
            pkgId = nextPkgId++
            packageMap.set(pkgName, pkgId)
            packages.push([pkgId, pkgName, 'cisa'])
        }

        vulnerabilities.push([
            nextVulnId++,
            pkgId,
            null, // version_start
            null, // version_end
            'HIGH', // default for KEV
            v.cveID,
            v.shortDescription,
        ])
    }

    const content = `/**
 *  Static setup structured Data (Packages and Vulnerabilities)
 *  Updated by crawler at ${new Date().toISOString()}
 */

export const SQL_SCHEMA = \`
-- Table of known software packages
CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    repository TEXT TEXT CHECK( repository IN ('npm','maven','pypi', 'rpm', 'cisa') ) NOT NULL
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
\`;

export const SQL_DATA = [
    {
        table: 'packages',
        data: ${JSON.stringify(packages, null, 8)}
    },
    {
        table: 'vulnerabilities',
        data: ${JSON.stringify(vulnerabilities, null, 8)}
    }
];
`
    fs.writeFileSync(STRUCTURED_FILE_PATH, content)
    console.log(`Updated ${STRUCTURED_FILE_PATH}`)
}

async function run() {
    const cisaData = await getCisaData()
    const russianDocs = await getRussianDocuments()

    await updateUnstructured(russianDocs)
    await updateStructured(cisaData)

    console.log('Done!')
}

run()
