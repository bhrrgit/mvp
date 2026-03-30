
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedWorkflow } from "../types";

// ─── API Key Validation ───
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  console.warn(
    '[MarketerAI] GEMINI_API_KEY is not configured. ' +
    'Set it in .env.local to enable workflow generation.'
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

// ─── Config ───
const MODEL_ID = 'gemini-2.0-flash';
const REQUEST_TIMEOUT_MS = 30_000;

// ─── Structured output schema ───
const WORKFLOW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A concise title for the workflow" },
    summary: { type: Type.STRING, description: "A 1-2 sentence summary of what the workflow does" },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: "The n8n node type (e.g., 'n8n-nodes-base.webhook')" },
          icon: { type: Type.STRING, description: "A Lucide icon name: 'Mail', 'Webhook', 'Database', 'MessageSquare', 'Send', 'Layout', 'Bell', 'Share2', 'CreditCard', 'Instagram'" },
          description: { type: Type.STRING }
        },
        required: ["id", "name", "type", "icon", "description"]
      }
    },
    jsonPreview: { type: Type.STRING, description: "A sample n8n-compatible JSON structure for this workflow." },
    setupGuide: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions for configuring this workflow in n8n."
    }
  },
  required: ["title", "summary", "steps", "jsonPreview", "setupGuide"]
} as const;

const SYSTEM_INSTRUCTION =
  `You are a senior automation architect specializing in n8n and marketing operations. ` +
  `Interpret the user's natural language request into a clear, logical n8n workflow. ` +
  `Produce 3-5 workflow steps. Each step should be a real n8n node type. ` +
  `The jsonPreview should be a realistic n8n workflow JSON snippet. ` +
  `The setupGuide should have 3-6 actionable steps for configuring credentials and nodes.`;

// ─── Type guard for parsed response ───
function isValidWorkflow(data: unknown): data is GeneratedWorkflow {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj.title === 'string' && obj.title.length > 0 &&
    typeof obj.summary === 'string' &&
    Array.isArray(obj.steps) && obj.steps.length > 0 &&
    typeof obj.jsonPreview === 'string' &&
    Array.isArray(obj.setupGuide)
  );
}

// ─── Main API function ───
export async function generateWorkflowFromPrompt(
  prompt: string,
  signal?: AbortSignal
): Promise<GeneratedWorkflow> {
  // Pre-flight checks
  if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
    throw new Error(
      'API key not configured. Please add your GEMINI_API_KEY to the .env.local file.'
    );
  }

  if (!prompt.trim()) {
    throw new Error('Please enter a prompt describing the automation you want to build.');
  }

  // Timeout via AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Merge external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: `Translate this marketing automation request into a structured n8n workflow concept: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: WORKFLOW_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    clearTimeout(timeoutId);

    // Validate response exists
    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response from AI model. Please try again.');
    }

    // Parse and validate structure
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error('[MarketerAI] Failed to parse response JSON:', rawText.slice(0, 200));
      throw new Error('Invalid response format. Please try a different prompt.');
    }

    if (!isValidWorkflow(parsed)) {
      console.error('[MarketerAI] Response failed validation:', parsed);
      throw new Error('The generated workflow was incomplete. Please try again.');
    }

    return parsed;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Categorize errors for better UX
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env.local.');
    }

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('API rate limit reached. Please wait a moment and try again.');
    }

    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    // Re-throw our own errors as-is
    if (error.message?.startsWith('API key') ||
        error.message?.startsWith('Please') ||
        error.message?.startsWith('Empty') ||
        error.message?.startsWith('Invalid') ||
        error.message?.startsWith('The generated') ||
        error.message?.startsWith('Request timed')) {
      throw error;
    }

    console.error('[MarketerAI] Unexpected error:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
}
