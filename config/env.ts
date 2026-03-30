/**
 * config/env.ts
 *
 * Single source of truth for all environment-driven configuration.
 *
 * TypeScript patterns used (from typescript-advanced-types + typescript-expert):
 *  - Branded primitives   → `GeminiApiKey`, `GeminiModelId`, `Milliseconds`
 *                           prevent passing a plain `string` where a typed
 *                           primitive is expected at compile time.
 *  - `satisfies` operator → validates the defaults object shape at compile
 *                           time while preserving narrow literal types.
 *  - `as const` tuple     → single source of truth for allowed model IDs;
 *                           the `GeminiModel` union is derived from it.
 *  - Discriminated union  → `EnvResult<T>` forces callers to handle both
 *                           success and failure paths explicitly.
 *  - Type predicates      → `isEnvError` / `isEnvOk` enable TypeScript to
 *                           narrow the union without relying on `!ok` checks
 *                           that the compiler sometimes fails to narrow.
 *  - `const` assertions   → `GEMINI_MODELS as const` derives the union type.
 */

// ─── 1. Branded primitive types ─────────────────────────────────────────────

type Brand<Base, Tag> = Base & { readonly __brand: Tag };

export type GeminiApiKey  = Brand<string, 'GeminiApiKey'>;
export type GeminiModelId = Brand<string, 'GeminiModelId'>;
export type Milliseconds   = Brand<number, 'Milliseconds'>;

// ─── 2. Allowed Gemini models – single source of truth ───────────────────────

const GEMINI_MODELS = [
  'gemini-3-flash-preview',
] as const;

export type GeminiModel = (typeof GEMINI_MODELS)[number];

// ─── 3. Env-var keys – template-literal union type ────────────────────────────

type GeminiEnvKey =
  | 'GEMINI_API_KEY'
  | 'VITE_GEMINI_API_KEY'
  | 'API_KEY'
  | 'GEMINI_MODEL'
  | 'GEMINI_TIMEOUT_MS';
type AppEnvKey    = 'VITE_BASE_PATH';
export type EnvKey = GeminiEnvKey | AppEnvKey;

// ─── 4. Defaults validated with `satisfies` ───────────────────────────────────
//
// `satisfies` checks the shape without widening, so ENV_DEFAULTS.GEMINI_MODEL
// stays the literal `'gemini-3-flash-preview'`, not the wide `string`.

const ENV_DEFAULTS = {
  GEMINI_MODEL:      'gemini-3-flash-preview',
  GEMINI_TIMEOUT_MS: '30000',
  VITE_BASE_PATH:    '/',
} satisfies Partial<Record<EnvKey, string>>;

// ─── 5. Discriminated-union result type ──────────────────────────────────────

export type EnvOk<T>  = { readonly ok: true;  readonly value: T };
export type EnvErr    = { readonly ok: false;  readonly error: string };
export type EnvResult<T> = EnvOk<T> | EnvErr;

// ── Type predicates for safe narrowing ───────────────────────────────────────
//
// Using explicit predicates instead of `if (!result.ok)` avoids the TypeScript
// narrowing limitation where `!literal_boolean` does not always refine the
// discriminated union member (TS2339 inside the branch).

export function isEnvOk<T>(result: EnvResult<T>): result is EnvOk<T> {
  return result.ok === true;
}

export function isEnvError<T>(result: EnvResult<T>): result is EnvErr {
  return result.ok === false;
}

// ─── 6. Config interfaces ─────────────────────────────────────────────────────

export interface GeminiConfig {
  readonly apiKey:    GeminiApiKey;
  readonly model:     GeminiModelId;
  readonly timeoutMs: Milliseconds;
}

export interface AppEnvConfig {
  readonly gemini: GeminiConfig;
  readonly app: {
    readonly basePath: string;
  };
}

// ─── 7. Type guards ───────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidApiKey(value: string): value is GeminiApiKey {
  return (
    isNonEmptyString(value) &&
    value !== 'PLACEHOLDER_API_KEY' &&
    value !== 'undefined' &&
    value !== 'null'
  );
}

function isGeminiModel(value: string): value is GeminiModel {
  return (GEMINI_MODELS as readonly string[]).includes(value);
}

// ─── 8. Low-level env reader ──────────────────────────────────────────────────
//
// Works in all three execution contexts:
//   a) Browser bundle – Vite's `define` replaced `process.env.*` at build time.
//   b) Node.js / CI  – `process.env` is the real OS environment.
//   c) Unit tests    – same as (b), or overridden via test setup.

function readRaw(key: EnvKey): string {
  try {
    const val = (process as NodeJS.Process).env[key as string];
    return isNonEmptyString(val) ? val : '';
  } catch {
    return '';
  }
}

// ─── 9. Field resolvers – return nullable values, no discriminated union ──────
//
// Using simple nullable returns for internal helpers avoids discriminated-union
// narrowing pitfalls; the public API surface (loadEnvConfig) composes them.

function resolveApiKey(): GeminiApiKey | null {
  const raw =
    readRaw('GEMINI_API_KEY') ||
    readRaw('VITE_GEMINI_API_KEY') ||
    readRaw('API_KEY');
  return isValidApiKey(raw) ? raw : null;
}

function resolveModel(): GeminiModelId {
  const raw = readRaw('GEMINI_MODEL');
  const model = isGeminiModel(raw) ? raw : ENV_DEFAULTS.GEMINI_MODEL;
  return model as GeminiModelId;
}

function resolveTimeoutMs(): Milliseconds {
  const raw    = readRaw('GEMINI_TIMEOUT_MS') || ENV_DEFAULTS.GEMINI_TIMEOUT_MS;
  const parsed = parseInt(raw, 10);
  // Clamp: 5 s – 120 s
  const ms = Number.isFinite(parsed)
    ? Math.max(5_000, Math.min(120_000, parsed))
    : 30_000;
  return ms as Milliseconds;
}

// ─── 10. Public config loader (never throws, returns discriminated union) ─────

export function loadEnvConfig(): EnvResult<AppEnvConfig> {
  const apiKey = resolveApiKey();

  if (apiKey === null) {
    return {
      ok:    false,
      error: 'GEMINI_API_KEY is missing or invalid. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env.local, .env, or your deployment environment.',
    };
  }

  const config: AppEnvConfig = {
    gemini: {
      apiKey,
      model:     resolveModel(),
      timeoutMs: resolveTimeoutMs(),
    },
    app: {
      basePath: readRaw('VITE_BASE_PATH') || ENV_DEFAULTS.VITE_BASE_PATH,
    },
  };

  return { ok: true, value: config };
}

// ─── 11. Validated singleton ──────────────────────────────────────────────────
//
// Evaluated once on first import. Every module that imports `env` shares
// the same validated reference. Call `loadEnvConfig()` directly in tests
// to get a fresh evaluation.
//
// In the browser the key check is intentionally deferred to call time so
// the app renders without a key — users see a clear error only when they
// click "Generate".

export const env: EnvResult<AppEnvConfig> = loadEnvConfig();

// ─── 12. Imperative accessor – use only at generation time ───────────────────
//
// Throws a user-friendly Error if the key is missing/invalid.
// Import this in services that must have the config to proceed.

export function requireEnv(): AppEnvConfig {
  // Re-evaluate on demand so runtime env changes (tests/Node scripts) are respected.
  const current = loadEnvConfig();
  if (isEnvError(current)) {
    throw new Error(current.error);
  }
  return current.value;
}
