/**
 * Configuration Constants
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */
import path from 'node:path'

const DATA_DIRECTORY = 'data'

export const SQLITE_DB_PATH = path.join(DATA_DIRECTORY, 'vulnerability_db.db')
export const TFIDF_MODEL_PATH = path.join(DATA_DIRECTORY, 'tfidf_model.json')

/* Ollama Service Configuration */
export const OLLAMA_MODEL = 'llama3'
export const OLLAMA_URL = 'http://localhost:11434/api/generate'
