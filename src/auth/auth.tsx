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
  });

  const {
    data: userRefresh,
    isError: isErrorRefresh,
    refetch: getRefresh,
  } = useQuery<LogInCallbackTokenResponse>({
    queryKey: ["refresh", refresh],
    queryFn: async () => {
      console.log("refresh");
      return await fetchData(`/users/refresh?token=${refresh}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    },
    enabled: false,
  });

  const clearTokens = useCallback(() => {
    setToken(null);
    setRefresh(null);
    removeAccessToken();
    removeRefreshToken();
    setIsAuthenticated(false);
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setRefresh(refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isErrorRefresh) {
      clearTokens();
    }
  }, [isErrorRefresh, clearTokens]);

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
      clearTokens();
      toast({
        variant: "destructive",
        title: "Please re-login",
      });
    } else if (
      (isError &&
        (error?.message.includes("invalid") ||
          error?.message.includes("expired"))) ||
      (!token && refresh)
    ) {
      if (refresh) {
        setToken(null);
        removeAccessToken();
        getRefresh();
      } else {
        clearTokens();
        toast({
          variant: "destructive",
          title: "Please re-login",
        });
      }
    }
  }, [
    clearTokens,
    error,
    isError,
    toast,
    refresh,
    setToken,
    getRefresh,
    token,
  ]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        refresh,
        setTokens,
        clearTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
