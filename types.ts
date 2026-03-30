
// ─── Domain Types ───

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
}

export interface GeneratedWorkflow {
  title: string;
  summary: string;
  steps: WorkflowStep[];
  jsonPreview: string;
  setupGuide: string[];
}

// ─── Workflow Generation State ───

export enum WorkflowStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// Keep backward compat alias
export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULT = 'RESULT'
}

// ─── History ───

export interface HistoryEntry {
  id: string;
  prompt: string;
  workflow: GeneratedWorkflow;
  createdAt: number; // timestamp
}

// ─── Global App State ───

export interface AppGlobalState {
  // Workflow generation
  prompt: string;
  status: WorkflowStatus;
  currentWorkflow: GeneratedWorkflow | null;
  error: string | null;

  // Workflow history
  history: HistoryEntry[];

  // UI
  currentRoute: string;
}

// ─── Actions ───

export type AppAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: GeneratedWorkflow }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'RESET_WORKFLOW' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'REMOVE_HISTORY_ENTRY'; payload: string }
  | { type: 'CLEAR_HISTORY' };

// ─── Route Constants ───

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  DASHBOARD: '/dashboard',
  DOCS: '/docs',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
