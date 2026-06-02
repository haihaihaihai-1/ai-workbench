/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LANGFUSE_PUBLIC_KEY: string;
  readonly VITE_LANGFUSE_SECRET_KEY: string;
  readonly VITE_LANGFUSE_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
