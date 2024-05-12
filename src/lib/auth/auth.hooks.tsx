import { useContext } from "react";
import { AuthContext } from "./auth";
import { IAuthContext } from "./type";

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: false,
      user: undefined,
      token: null,
      logout: () => {},
      setTokens: () => {},
    };
  }
  return context;
}
