import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env files from project root (.env, .env.local, .env.[mode])
  const env = loadEnv(mode, process.cwd(), '');

  const apiKey =
    env.GEMINI_API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';
  const basePath = normalizeBasePath(env.VITE_BASE_PATH || process.env.VITE_BASE_PATH);

  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.warn(
      '\n⚠️  Gemini API key is not set or is using the placeholder value.\n' +
      '   Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env.local/.env.\n'
    );
  }

  return {
    // Allows GitHub Pages deployments to work under /<repo>/ while keeping "/" locally.
    base: basePath,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Inject the API key at build time.
      // NOTE: This exposes the key in the client bundle.
      // For production, move API calls to a backend proxy.
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      target: 'es2020',
      sourcemap: false,
    }
  };
});

function normalizeBasePath(basePath?: string): string {
  const rawValue = (basePath || '/').trim();

  if (!rawValue || rawValue === '.') {
    return '/';
  }

  const withLeadingSlash = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}
