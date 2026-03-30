import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.error(
    "[workflow-validation] Missing GEMINI_API_KEY. Configure it in repository secrets."
  );
  process.exit(1);
}

const MODEL_ID = "gemini-2.0-flash";
const VALIDATION_PROMPT =
  process.env.WORKFLOW_VALIDATION_PROMPT ||
  "Capture Instagram leads via webhook, append to Google Sheets, then send a welcome email.";

const WORKFLOW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          icon: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["id", "name", "type", "icon", "description"],
      },
    },
    jsonPreview: { type: Type.STRING },
    setupGuide: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["title", "summary", "steps", "jsonPreview", "setupGuide"],
};

const SYSTEM_INSTRUCTION =
  "You are a senior automation architect specializing in n8n and marketing operations. " +
  "Interpret the user request into a clear n8n workflow. " +
  "Produce 3-5 workflow steps using real n8n node types. " +
  "The jsonPreview must be a realistic n8n workflow JSON snippet with nodes and connections.";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateWorkflowShape(payload) {
  assert(isObject(payload), "Model response is not an object.");
  assert(typeof payload.title === "string" && payload.title.length > 0, "Missing title.");
  assert(typeof payload.summary === "string" && payload.summary.length > 0, "Missing summary.");
  assert(Array.isArray(payload.steps) && payload.steps.length > 0, "Missing steps.");
  assert(
    typeof payload.jsonPreview === "string" && payload.jsonPreview.length > 0,
    "Missing jsonPreview."
  );
  assert(
    Array.isArray(payload.setupGuide) && payload.setupGuide.length > 0,
    "Missing setupGuide."
  );
}

function validateN8nPreview(jsonPreviewText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonPreviewText);
  } catch (error) {
    throw new Error(
      `jsonPreview is not valid JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  assert(isObject(parsed), "jsonPreview root must be an object.");
  assert(Array.isArray(parsed.nodes), "jsonPreview must include a nodes array.");
  assert(parsed.nodes.length > 0, "jsonPreview nodes cannot be empty.");
  assert(isObject(parsed.connections), "jsonPreview must include a connections object.");

  for (const [index, node] of parsed.nodes.entries()) {
    assert(isObject(node), `Node at index ${index} must be an object.`);
    assert(typeof node.name === "string" && node.name.length > 0, `Node ${index} missing name.`);
    assert(typeof node.type === "string" && node.type.length > 0, `Node ${index} missing type.`);
  }

  return parsed;
}

async function run() {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: `Translate this request into a structured n8n workflow: "${VALIDATION_PROMPT}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: WORKFLOW_SCHEMA,
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  const rawText = response.text?.trim();
  assert(rawText, "Model returned empty response.");

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(
      `Model response is not valid JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  validateWorkflowShape(parsed);
  const n8n = validateN8nPreview(parsed.jsonPreview);

  console.log("[workflow-validation] Live validation succeeded.");
  console.log(`[workflow-validation] Title: ${parsed.title}`);
  console.log(
    `[workflow-validation] Steps: ${parsed.steps.length}, Nodes: ${n8n.nodes.length}`
  );
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[workflow-validation] ${message}`);
  process.exit(1);
});
