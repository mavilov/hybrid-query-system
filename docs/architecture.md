# Solution Description

This document describes the actual architecture implemented in the repository as of 15 Nov 2025.

## High-level overview

- CLI entrypoint: [`src/start.js`](../src/start.js) — parses CLI args and boots an App instance.
- Application core: [`src/App.js`](../src/App.js) — encapsulates lifecycle: DB init/close, single-query execution, interactive loop, and orchestration of query processing.
- Query planner / decomposer: [`src/query-decomposer/ollama.js`](../src/query-decomposer/ollama.js) — calls the local Ollama service to classify a user question as `SQL`, `VECTOR`, or `HYBRID` and to produce a small JSON plan (sqlQuery, vectorSearchTerm, finalAnswerPrompt).
- Hybrid executor: [`query-runner/hybrid.js`](../src/query-runner/hybrid.js) — runs SQL queries against SQLite and vector lookups against the TF‑IDF model, then synthesizes results per `finalAnswerPrompt`.
- Structured data setup: [`src/initial-data-setup/dataSetup.js`](../src/initial-data-setup/dataSetup.js) — creates SQLite schema, inserts seed data and generates TF‑IDF model file.
- TF‑IDF model: [`src/tf-idf/ModelGenerator.js`](../src/tf-idf/ModelGenerator.js) — has functions to build the vector index from the corpus and write `data/tfidf_model.json`.
- Configuration: [`src/config.js`](../src/config.js) — central constants (paths, Ollama URL/model)
- Data files: `data/vulnerability_db.db` (SQLite) and `data/tfidf_model.json` (TF‑IDF index). They need to be generated, and must not be committed to git.

## Relational data model

- packages(package_id, name, repository)
- vulnerabilities(vuln_id, package_id, version_start, version_end, severity, cve_id, summary)

The SQL schema and initial seed rows for testing live in [`src/initial-data-setup/structured.js`](../src/initial-data-setup/structured.js).

## Request and execution flow

1. User invokes CLI:
    - Single-query:

    ```bash
    node src/start.js "Is axios secure? Can it be exploited? Which versions had known vulnerabilities"
    ```

    - Interactive mode:

    ```bash
    npm run start
    ```

    then prompt within a loop.

2. `start.js` constructs `App` and initializes (validates DB file + opens connection).
3. `App` asks `decomposeQuery(query)` to produce a deterministic plan (via Ollama).
4. Based on plan type:
    - SQL: execute SQL against SQLite, return structured rows.
    - VECTOR: search TF‑IDF `data/tfidf_model.json` for top documents.
    - HYBRID: run SQL, then use SQL output (e.g., CVE) to craft vector lookup, then synthesize.
5. Results are combined according to `finalAnswerPrompt` and printed to stdout; errors go to stderr. Exit codes: 0 means success, non-zero - failure.

## Design and testing notes

- Dependency injection and encapsulation: `App` class isolates side effects (DB, readline, runner) to make unit testing easier.
- External services are isolated:
    - Ollama (local API) is called only from `query_decomposer/ollama.js` and can be mocked during tests.
    - TF‑IDF index is read from disk (`data/tfidf_model.json`) for vector lookup.
- Tests use Node.js built-in test runner (`node --test`) and mock external I/O (DB, file system, Ollama) to provide fast deterministic tests.
- Coverage report

## Operational considerations and security

- Seed and model generation are explicit: run `npm run setup` to create/update data files from the predefined corpus.
- Snyk code scan flags one place as problematic that I chose to ignore so I can mention it
- [`package.json`](../package.json) has one dev dependency that is risky - not addressing yet to demonstrate that I spotted it. For my purposes the risk of exploiting is low.

## Why this structure?

My thinking regarding what to present, considering that I have only 4 calendar days with very limited availability. What is important and what are tradeoffs? Let me elaborate.

- Clear separation between decomposition/planning (LLM), execution (SQL/vector), answer generation, and orchestration (App) keeps responsibilities small and testable.
- Using SQLite + a small TF‑IDF index is lightweight and reproducible for the assignment scope.
- The _App_ class and DI-friendly modules support unit tests and make the CLI ergonomics straightforward.
- `package.json` - yes, but no module/cli generation as npm does its job
- Linting from day 1 with _ESLint_
- pretty formatting from day 1 with _Prettier_
- No frameworks for the core task, but look - I can use libraries! Besides `better-sqlite3`, `https-status-code` is used just because of one particular code! Not too much waste, rather a demonstration.
- Markdown documents to state assumptions, as well as to document my reasoning and avoid stress/rush during the presentation.

Not specific to any components I mention below, following improvements could be potentially made if I'd have a few more days.

- add more unit tests
- add e2e test involving Ollama
- Docker to fix the enviromnent, especially for e2e testing in GitHub
- Maybe use TypeScript, but I question its value for the particular use case.
- Go full-blown with no LLM for query decomposition and answer synthesis tasks, but as I mentioned, no time to do it with reasonably good quality.
- make an http endpoint
- write a simple UI, maybe use [Lovable](https://lovable.dev/) to generate it and connect to my endpoint
- test everything in isolation as well as the whole flow e2e

### Query decomposition

Calling LLM for query decomposition is fine, so I went this way. At first, I used Gemini and faced its rate limiting pretty soon. This is a risk for my interview, I really need something that I can control better. Next try was Ollama and it worked well so far. I decided not to use any proxy libraries like LangChain and made the decomposition just work.

#### Improvement ideas

- LangChain could be of a help to transition to something better. One could write _tools_ for LangChain to do custom query parsing, but **good** query parsing is not a trivial task.
- Doing multiple pattern searches could lead to unmanageable mess pretty fast for this test assignment. Unless we fix a few sentence structures.
- Account for misspelling (word distance calculations allowing for a single typo or N typos)

### Query runner

No compromise here, I need to demonstrate that:

- I am capable of writing code that can execute `SELECT` statements against SQLite.
- I understand how [TF-IDF](https://en.wikipedia.org/wiki/Tf–idf) works and I can calculate embeddings and perform vector searches.

I am new to implementing vector search myself. I can spend the majority of the time with this and will play in a less familiar field. However, that needs to be implemented, no matter what, and it has to work well.

#### Improvement ideas

- ~~just use MongoDB Atlas~~
- read about and apply more advanced algorythm. SQL does the exact search, and there might be issues with package name variations.
- Maybe ORM could be of some tiny help for relational data generation and extraction (bells and whistles for this task).

### Answer generation

### Data loading

Data can be loaded from static, hardcoded sources into a database (`vulnerability_db.db` file) and embeddings file (`tfidf_model.json` file) with this command

```bash
npm run setup
```

and generated files can be removed and regenerated with

```bash
npm run resetData
```

#### Improvement ideas

- CSV file for loading into SQL database. Handy to update.
- read files with unstructured data from local fs
- crawl [Snyk](https://security.snyk.io/vuln/) or similar sites
