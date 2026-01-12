/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRIAL_API_KEY: string
  readonly VITE_TRIAL_MODEL: string
  readonly VITE_TRIAL_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}