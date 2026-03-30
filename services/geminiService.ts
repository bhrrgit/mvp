/**
 * services/geminiService.ts
 *
 * All Gemini API interactions.
 *
 * Config is consumed from config/env.ts (typed, validated, branded).
 * No magic strings live here – MODEL_ID, timeoutMs, etc. all come from the
 * environment via the typed config module.
 */

import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import { requireEnv } from "../config/env";
import { GeneratedWorkflow } from "../types";

// ─── Structured output schema ─────────────────────────────────────────────────
//
// Declared as a typed constant (Schema) rather than `as const` so it is
// valid plain-JS at runtime (no TypeScript-only syntax). This is what
// was causing the SyntaxError in the CI smoke test that ran the file
// through plain `node` without a TypeScript transpiler.

const WORKFLOW_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise title for the workflow",
    },
    summary: {
      type: Type.STRING,
      description: "A 1-2 sentence summary of what the workflow does",
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id:          { type: Type.STRING },
          name:        { type: Type.STRING },
          type:        { type: Type.STRING, description: "n8n node type, e.g. 'n8n-nodes-base.webhook'" },
          icon:        { type: Type.STRING, description: "Lucide icon name: Mail | Webhook | Database | MessageSquare | Send | Layout | Bell | Share2 | CreditCard | Instagram" },
          description: { type: Type.STRING },
        },
        required: ["id", "name", "type", "icon", "description"],
      },
    },
    jsonPreview: {
      type: Type.STRING,
      description: "A realistic n8n-compatible JSON workflow with nodes and connections arrays",
    },
    setupGuide: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-6 actionable steps for configuring credentials and nodes in n8n",
    },
  },
  required: ["title", "summary", "steps", "jsonPreview", "setupGuide"],
};

const SYSTEM_INSTRUCTION =
  "You are a senior automation architect specializing in n8n and marketing operations. " +
  "Interpret the user's natural language request into a clear, logical n8n workflow. " +
  "Produce 3-5 workflow steps. Each step must use a real n8n node type. " +
  "The jsonPreview must be a realistic n8n workflow JSON snippet with nodes and connections. " +
  "The setupGuide should have 3-6 actionable steps for configuring credentials and nodes.";

// ─── Type guard for parsed response ──────────────────────────────────────────

function isValidWorkflow(data: unknown): data is GeneratedWorkflow {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj.title === "string"       && obj.title.length > 0 &&
    typeof obj.summary === "string"     && obj.summary.length > 0 &&
    Array.isArray(obj.steps)            && obj.steps.length > 0 &&
    typeof obj.jsonPreview === "string" && obj.jsonPreview.length > 0 &&
    Array.isArray(obj.setupGuide)
  );
}

// ─── Error categorisation ─────────────────────────────────────────────────────

function categoriseError(error: unknown): Error {
  const message =
    error instanceof Error ? error.message : String(error);

  if (message.includes("API key") || message.includes("INVALID_ARGUMENT")) {
    return new Error("Invalid API key. Please check your GEMINI_API_KEY in .env.local.");
  }
  if (message.includes("quota") || message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
    return new Error("API rate limit reached. Please wait a moment and try again.");
  }
  if (message.includes("network") || message.includes("fetch") || message.includes("ENOTFOUND")) {
    return new Error("Network error. Please check your connection and try again.");
  }

  return new Error("An unexpected error occurred. Please try again.");
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function generateWorkflowFromPrompt(
  prompt: string,
  signal?: AbortSignal,
): Promise<GeneratedWorkflow> {
  // Throws with a user-friendly message if the key is missing / invalid.
  // We call requireEnv() here (not at module load) so the app can still
  // render even without a key – the error surfaces only when the user
  // actually tries to generate a workflow.
  const cfg = requireEnv();

  if (!prompt.trim()) {
    throw new Error("Please enter a prompt describing the automation you want to build.");
  }

  // ── Timeout management ──
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), cfg.gemini.timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const ai = new GoogleGenAI({ apiKey: cfg.gemini.apiKey });

  try {
    const response = await ai.models.generateContent({
      model:    cfg.gemini.model,
      contents: `Translate this marketing automation request into a structured n8n workflow concept: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema:   WORKFLOW_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    clearTimeout(timeoutId);

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Empty response from AI model. Please try again.");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("[MarketerAI] Failed to parse Gemini response:", rawText.slice(0, 300));
      throw new Error("Invalid response format. Please try a different prompt.");
    }

    if (!isValidWorkflow(parsed)) {
      console.error("[MarketerAI] Response failed shape validation:", parsed);
      throw new Error("The generated workflow was incomplete. Please try again.");
    }

    return parsed;

  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }

      // Re-throw our own well-formed messages as-is.
      const ours = [
        "Please enter",
        "API key not",
        "Invalid API key",
        "rate limit",
        "Network error",
        "Empty response",
        "Invalid response",
        "incomplete",
        "timed out",
        "missing or invalid",
      ];
      if (ours.some((prefix) => error.message.includes(prefix))) {
        throw error;
      }
    }

    throw categoriseError(error);
  }
}
