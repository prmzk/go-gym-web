import { LogInCallbackTokenResponse } from "@/pages/Auth/Login/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export interface IAuthContext {
  isAuthenticated: boolean | undefined;
  user: User | undefined;
  token: string | null;
  logout?: (noToast?: boolean) => void;
  setTokens?: (accessToken: string, refreshToken: string) => void;
  getRefresh?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<LogInCallbackTokenResponse, Error>>;
}
