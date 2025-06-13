import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  uploadedFile: File | null;
  fileName: string | null;
  isUploading: boolean;
  summary: string | null;
  pptPath: string | null;
  podcastPath: string | null;
  loadingStates: {
    summary: boolean;
    ppt: boolean;
    podcast: boolean;
  };
}

type AppAction =
  | { type: 'SET_UPLOADED_FILE'; payload: { file: File; fileName: string } }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'SET_PPT_PATH'; payload: string }
  | { type: 'SET_PODCAST_PATH'; payload: string }
  | { type: 'SET_LOADING'; payload: { type: 'summary' | 'ppt' | 'podcast'; loading: boolean } }
  | { type: 'CLEAR_DATA' };

const initialState: AppState = {
  uploadedFile: null,
  fileName: null,
  isUploading: false,
  summary: null,
  pptPath: null,
  podcastPath: null,
  loadingStates: {
    summary: false,
    ppt: false,
    podcast: false,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_UPLOADED_FILE':
      return {
        ...state,
        uploadedFile: action.payload.file,
        fileName: action.payload.fileName,
      };
    case 'SET_UPLOADING':
      return {
        ...state,
        isUploading: action.payload,
      };
    case 'SET_SUMMARY':
      return {
        ...state,
        summary: action.payload,
      };
    case 'SET_PPT_PATH':
      return {
        ...state,
        pptPath: action.payload,
      };
    case 'SET_PODCAST_PATH':
      return {
        ...state,
        podcastPath: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.type]: action.payload.loading,
        },
      };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};