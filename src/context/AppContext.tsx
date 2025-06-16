import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, Component, DatabaseTable, Workflow, Integration, User } from '../types';

interface AppState {
  currentProject: Project | null;
  projects: Project[];
  components: Component[];
  databaseTables: DatabaseTable[];
  workflows: Workflow[];
  integrations: Integration[];
  user: User | null;
  activeView: 'dashboard' | 'builder' | 'database' | 'workflows' | 'integrations' | 'analytics';
  selectedComponent: Component | null;
  previewMode: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: Project }
  | { type: 'SET_ACTIVE_VIEW'; payload: AppState['activeView'] }
  | { type: 'SET_SELECTED_COMPONENT'; payload: Component | null }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'ADD_COMPONENT'; payload: Component }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<Component> } }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'ADD_DATABASE_TABLE'; payload: DatabaseTable }
  | { type: 'UPDATE_DATABASE_TABLE'; payload: { id: string; updates: Partial<DatabaseTable> } }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: { id: string; updates: Partial<Workflow> } };

const initialState: AppState = {
  currentProject: null,
  projects: [],
  components: [],
  databaseTables: [],
  workflows: [],
  integrations: [],
  user: {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    role: 'owner'
  },
  activeView: 'dashboard',
  selectedComponent: null,
  previewMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_SELECTED_COMPONENT':
      return { ...state, selectedComponent: action.payload };
    case 'TOGGLE_PREVIEW_MODE':
      return { ...state, previewMode: !state.previewMode };
    case 'ADD_COMPONENT':
      return { ...state, components: [...state.components, action.payload] };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.updates } : comp
        )
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload)
      };
    case 'ADD_DATABASE_TABLE':
      return { ...state, databaseTables: [...state.databaseTables, action.payload] };
    case 'UPDATE_DATABASE_TABLE':
      return {
        ...state,
        databaseTables: state.databaseTables.map(table =>
          table.id === action.payload.id ? { ...table, ...action.payload.updates } : table
        )
      };
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow =>
          workflow.id === action.payload.id ? { ...workflow, ...action.payload.updates } : workflow
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}