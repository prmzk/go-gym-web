import { useToast } from "@/components/ui/use-toast";
import fetchData from "@/lib/api";
import { LogInCallbackTokenResponse } from "@/pages/Auth/Login/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
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
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [refresh, setRefresh] = useState<string | null>(getRefreshToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!token || !!refresh
  );

  const {
    data: user,
    isError,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ["me", token],
    queryFn: async () => {
      return await fetchData("/users/me", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }),
      });
    },
    retry: false,
    enabled: !!token,
    staleTime: 60 * 1000,
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
      setRefresh(null);
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
    setRefresh(refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isErrorRefresh) {
      logout();
    }
  }, [logout, isErrorRefresh]);

  useEffect(() => {
    if (userRefresh) {
      setTokens(userRefresh.accessToken, userRefresh.refreshToken);
    }
  }, [userRefresh, setTokens]);

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  useEffect(() => {
    if (isError && error?.message === "invalid bearer token") {
      logout();
    } else if (
      (isError &&
        (error?.message.includes("access") ||
          error?.message.includes("expired"))) ||
      (!token && refresh)
    ) {
      if (refresh) {
        setToken(null);
        removeAccessToken();
        getRefresh();
      } else {
        logout();
      }
    }
  }, [logout, error, isError, toast, refresh, setToken, getRefresh, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        refresh,
        setTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
