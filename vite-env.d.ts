/// <reference types="vite/client" />

/**
 * vite-env.d.ts
 *
 * Extends Vite's built-in ImportMetaEnv with the project's own variables
 * so that `import.meta.env.VITE_*` accesses are type-checked.
 *
 * Also augments the Node.js `ProcessEnv` interface so `process.env.*`
 * accesses inside config/env.ts are typed (Vite replaces these at
 * build time via the `define` block in vite.config.ts).
 */

// ─── Vite client env (import.meta.env.VITE_*) ───────────────────────────────
interface ImportMetaEnv {
  /** Public base path for the app (e.g. "/" or "/marketerai/") */
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ─── Node / Vite define replacement (process.env.*) ──────────────────────────
//
// Vite's `define` block replaces `process.env.API_KEY` and
// `process.env.GEMINI_API_KEY` with string literals at build time.
// Declaring them here gives TypeScript visibility over those keys
// while keeping them `string | undefined` for safety.

declare namespace NodeJS {
  interface ProcessEnv {
    /** Gemini API key – injected by Vite's define block at build time */
    readonly GEMINI_API_KEY?: string;
    /** Legacy alias kept for backward compatibility */
    readonly API_KEY?: string;
    /**
     * Gemini model identifier.
     * Must be one of the values in GEMINI_MODELS (config/env.ts).
     * Defaults to 'gemini-2.0-flash'.
     */
    readonly GEMINI_MODEL?: string;
    /**
     * Request timeout in milliseconds (5 000 – 120 000).
     * Defaults to 30 000.
     */
    readonly GEMINI_TIMEOUT_MS?: string;
    /** Public base path forwarded from VITE_BASE_PATH */
    readonly VITE_BASE_PATH?: string;
  }
}
