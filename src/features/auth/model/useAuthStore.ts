import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthData, AuthState } from './types';

const initialState: AuthData = {
  accessToken: null,
  nickname: null,
  email: null,
  profileImageUrl: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (auth) => set(auth),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
