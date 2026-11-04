/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "api" to load data from the backend REST API instead of the in-browser demo data. */
  readonly VITE_DATA_SOURCE?: 'demo' | 'api';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
