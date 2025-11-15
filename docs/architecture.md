# Solution Description

This document describes the actual architecture implemented in the repository as of 15 Nov 2025.

## High-level overview

- CLI entrypoint: `src/start.js` — parses CLI args and boots an App instance.
- Application core: `src/App.js` — encapsulates lifecycle: DB init/close, single-query execution, interactive loop, and orchestration of query processing.
- Query planner / decomposer: `src/query_decomposer.js` — calls the local Ollama service to classify a user question as `SQL`, `VECTOR`, or `HYBRID` and to produce a small JSON plan (sqlQuery, vectorSearchTerm, finalAnswerPrompt).
- Hybrid executor: (implemented as a module referenced by `App`) — runs SQL queries against SQLite and vector lookups against the TF‑IDF model, then synthesizes results per `finalAnswerPrompt`.
- Structured data setup: `src/initial-data-setup/data_setup.js` (uses `src/initial-data-setup/structured.js` and `unstructured.js`) — creates SQLite schema, inserts seed data and generates TF‑IDF model file.
- TF‑IDF model: `src/tfidf_model.js` — builds the vector index from the corpus and writes `data/tfidf_model.json`.
- Configuration: `src/config.js` — central constants (paths, Ollama URL/model)
- Data files: `data/vulnerability_db.db` (SQLite) and `data/tfidf_model.json` (TF‑IDF index). They need to be generated, and must not be committed to git.

## Relational data model

- packages(package_id, name, repository)
- vulnerabilities(vuln_id, package_id, version_start, version_end, severity, cve_id, summary)

The SQL schema and initial seed rows for testing live in `src/initial-data-setup/structured.js`.

## Request and execution flow

1. User invokes CLI:
    - Single-query: `node src/start.js "What vulnerabilities does express have?"`
    - Interactive: `npm run start` then prompt loop.
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
    - Ollama (local API) is called only from `query_decomposer.js` and can be mocked during tests.
    - TF‑IDF index is read from disk (`data/tfidf_model.json`) for vector lookup.
- TODO: Tests use Node.js built-in test runner (`node --test`) and mock external I/O (DB, file system, Ollama) to provide fast deterministic tests.

## Operational considerations and security

- TODO: The Ollama endpoint could be made configurable via env (`OLLAMA_URL`) in the future to avoid hardcoding network targets.
- Seed and model generation are explicit: run `npm run setup` to create/update data files.
- TODO: Follow the project's Snyk policy: run snyk code scan for any generated or modified code and remediate findings before committing.

## Invocation examples

Single query:

```bash
node src/start.js "What vulnerabilities does the package express have?"
```

Interactive:

```bash
npm run start
# then follow the prompt, type `exit` to quit
```

## Why this structure?

- Clear separation between decomposition/planning (LLM), execution (SQL/vector), and orchestration (App) keeps responsibilities small and testable.
- Using SQLite + a small TF‑IDF index is lightweight and reproducible for the assignment scope.
- The App class and DI-friendly modules support unit tests and make the CLI ergonomics straightforward.
