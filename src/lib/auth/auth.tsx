import { useToast } from "@/components/ui/use-toast";
import { LogInCallbackTokenResponse } from "@/pages/Auth/Login/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import fetchData from "../api";
import { useAPIQuery } from "../api.hooks";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./tokensStorage";
import { IAuthContext, User } from "./type";

export const AuthContext = createContext<IAuthContext | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const refresh = getRefreshToken();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!token || !!refresh
  );

  const {
    data: user,
    isError,
    refetch,
  } = useAPIQuery<User>("/users/me", {
    queryKey: ["me", token],
    retry: false,
    staleTime: 60 * 1000,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    enabled: isAuthenticated,
  });

  const {
    data: userRefresh,
    isError: isErrorRefresh,
    refetch: getRefresh,
  } = useQuery<LogInCallbackTokenResponse>({
    queryKey: ["refresh", refresh],
    queryFn: async () => {
      return await fetchData(`/users/refresh?token=${refresh}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    },
    retry: 1,
    enabled: false,
  });

  const logout = useCallback(
    (noToast?: boolean) => {
      setToken(null);
      removeAccessToken();
      removeRefreshToken();
      setIsAuthenticated(false);
      if (!noToast) {
        toast({
          variant: "destructive",
          title: "Please re-login",
        });
      }
    },
    [toast]
  );

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  useEffect(() => {
    if (isError) {
      getRefresh();
    }
  }, [isError, getRefresh]);

  useEffect(() => {
    if (isErrorRefresh) {
      logout && logout();
    }
  }, [logout, isErrorRefresh]);

  useEffect(() => {
    if (userRefresh) {
      setTokens && setTokens(userRefresh.accessToken, userRefresh.refreshToken);
    }
  }, [userRefresh, setTokens]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        setTokens,
        getRefresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
