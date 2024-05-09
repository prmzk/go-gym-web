export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export interface IAuthContext {
  isAuthenticated: boolean;
  user: User | undefined;
  token: string | null;
  refresh: string | null;
  logout?: (noToast?: boolean) => void;
  setTokens?: (accessToken: string, refreshToken: string) => void;
}
