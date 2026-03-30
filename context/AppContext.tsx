
import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import {
  AppGlobalState,
  AppAction,
  WorkflowStatus,
  HistoryEntry,
  GeneratedWorkflow,
  ROUTES,
} from '../types';
import { generateWorkflowFromPrompt } from '../services/geminiService';

// ─── Initial State ───

const initialState: AppGlobalState = {
  prompt: '',
  status: WorkflowStatus.IDLE,
  currentWorkflow: null,
  error: null,
  history: [],
  currentRoute: window.location.hash
    ? window.location.hash.replace('#', '') || '/'
    : '/',
};

// ─── Reducer ───

function appReducer(state: AppGlobalState, action: AppAction): AppGlobalState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload, error: null };

    case 'START_GENERATION':
      return { ...state, status: WorkflowStatus.LOADING, error: null, currentWorkflow: null };

    case 'GENERATION_SUCCESS': {
      const entry: HistoryEntry = {
        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        prompt: state.prompt,
        workflow: action.payload,
        createdAt: Date.now(),
      };
      return {
        ...state,
        status: WorkflowStatus.SUCCESS,
        currentWorkflow: action.payload,
        error: null,
        history: [entry, ...state.history].slice(0, 50), // max 50 entries
      };
    }

    case 'GENERATION_ERROR':
      return { ...state, status: WorkflowStatus.ERROR, error: action.payload };

    case 'RESET_WORKFLOW':
      return { ...state, status: WorkflowStatus.IDLE, currentWorkflow: null, prompt: '', error: null };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'NAVIGATE':
      return { ...state, currentRoute: action.payload };

    case 'REMOVE_HISTORY_ENTRY':
      return {
        ...state,
        history: state.history.filter(h => h.id !== action.payload),
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    default:
      return state;
  }
}

// ─── Context Type ───

interface AppContextType {
  state: AppGlobalState;
  dispatch: React.Dispatch<AppAction>;

  // Convenience actions
  setPrompt: (prompt: string) => void;
  generateWorkflow: (prompt?: string) => Promise<void>;
  resetWorkflow: () => void;
  navigate: (route: string) => void;
  downloadJSON: (workflow: GeneratedWorkflow) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ───

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  const setPrompt = useCallback((prompt: string) => {
    dispatch({ type: 'SET_PROMPT', payload: prompt });
  }, []);

  const generateWorkflow = useCallback(async (promptOverride?: string) => {
    const text = promptOverride || state.prompt;
    if (!text.trim()) return;

    // If there's an override, set it first
    if (promptOverride) {
      dispatch({ type: 'SET_PROMPT', payload: promptOverride });
    }

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    dispatch({ type: 'START_GENERATION' });

    try {
      const data = await generateWorkflowFromPrompt(text, abortRef.current.signal);
      dispatch({ type: 'GENERATION_SUCCESS', payload: data });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        dispatch({
          type: 'GENERATION_ERROR',
          payload: err.message || 'An unexpected error occurred.',
        });
      }
    }
  }, [state.prompt]);

  const resetWorkflow = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    dispatch({ type: 'RESET_WORKFLOW' });
  }, []);

  const navigate = useCallback((route: string) => {
    window.location.hash = route;
    dispatch({ type: 'NAVIGATE', payload: route });
  }, []);

  const downloadJSON = useCallback((workflow: GeneratedWorkflow) => {
    const blob = new Blob([workflow.jsonPreview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.title.toLowerCase().replace(/\s+/g, '-')}-workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    setPrompt,
    generateWorkflow,
    resetWorkflow,
    navigate,
    downloadJSON,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ───

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
