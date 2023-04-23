/// Auth.tsx
import {create} from 'zustand';

interface AppState {
  showLoadingModal: boolean;
  setShowLoadingModal: (value: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
  showLoadingModal: false,
  setShowLoadingModal: value => {
    set({showLoadingModal: value});
  },
}));
