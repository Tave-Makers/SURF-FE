import { create } from 'zustand';
import { AuthData, AuthState } from './types';

const initialState: AuthData = {
  memberId: null,
  memberRole: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setAuth: (auth) => set((state) => ({ ...state, ...auth })),
  clearAuth: () => set(initialState),
}));
