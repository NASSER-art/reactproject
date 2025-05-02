import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UIState, MediaItem } from '@/types';

// Action types
type UIAction = 
  | { type: 'OPEN_MOBILE_MENU' }
  | { type: 'CLOSE_MOBILE_MENU' }
  | { type: 'OPEN_SEARCH_MODAL' }
  | { type: 'CLOSE_SEARCH_MODAL' }
  | { type: 'OPEN_DETAILS_MODAL'; media: MediaItem; mediaType: 'movie' | 'tv' }
  | { type: 'CLOSE_DETAILS_MODAL' };

const initialState: UIState = {
  mobileMenuOpen: false,
  searchModalOpen: false,
  detailsModalOpen: false,
};

// Reducer function
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'OPEN_MOBILE_MENU':
      return { ...state, mobileMenuOpen: true };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: false };
    case 'OPEN_SEARCH_MODAL':
      return { ...state, searchModalOpen: true };
    case 'CLOSE_SEARCH_MODAL':
      return { ...state, searchModalOpen: false };
    case 'OPEN_DETAILS_MODAL':
      return { 
        ...state, 
        detailsModalOpen: true, 
        currentMedia: action.media,
        mediaType: action.mediaType
      };
    case 'CLOSE_DETAILS_MODAL':
      return { ...state, detailsModalOpen: false };
    default:
      return state;
  }
}

// Create context
type UIContextType = {
  state: UIState;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openDetailsModal: (media: MediaItem, mediaType: 'movie' | 'tv') => void;
  closeDetailsModal: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider component
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const openMobileMenu = () => dispatch({ type: 'OPEN_MOBILE_MENU' });
  const closeMobileMenu = () => dispatch({ type: 'CLOSE_MOBILE_MENU' });
  const openSearchModal = () => dispatch({ type: 'OPEN_SEARCH_MODAL' });
  const closeSearchModal = () => dispatch({ type: 'CLOSE_SEARCH_MODAL' });
  const openDetailsModal = (media: MediaItem, mediaType: 'movie' | 'tv') => 
    dispatch({ type: 'OPEN_DETAILS_MODAL', media, mediaType });
  const closeDetailsModal = () => dispatch({ type: 'CLOSE_DETAILS_MODAL' });

  return (
    <UIContext.Provider value={{
      state,
      openMobileMenu,
      closeMobileMenu,
      openSearchModal,
      closeSearchModal,
      openDetailsModal,
      closeDetailsModal,
    }}>
      {children}
    </UIContext.Provider>
  );
}

// Custom hook for using the context
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
