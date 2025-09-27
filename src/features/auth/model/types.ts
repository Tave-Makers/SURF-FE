export type AuthData = {
  accessToken: string | null;
  nickname: string | null;
  email: string | null;
  profileImageUrl: string | null;
};

export type AuthState = AuthData & {
  setAuth: (auth: AuthData) => void;
  clearAuth: () => void;
};
