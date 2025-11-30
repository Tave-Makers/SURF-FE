import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthData, AuthState } from './types';

const initialState: AuthData = {
  accessToken: null,
  nickname: null,
  email: null,
  profileImageUrl: null,
  memberId: null,
  memberRole: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (auth) => set((state) => ({ ...state, ...auth })),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'SURF-auth',
    },
  ),
);
