import { useAPIQuery } from "@/lib/api.hooks";
import { Route } from "@/routes/login";
import { LogInCallbackTokenResponse } from "../Login/types";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth";

const TokenLogin = () => {
  const { setTokens } = useAuth();
  const { token } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isFetching, isError, isSuccess } =
    useAPIQuery<LogInCallbackTokenResponse>(
      `/users/login/callback?token=${token}`,
      {
        queryKey: ["login-token", token],
        retry: false,
        disableToast: true,
        noAuth: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

  useEffect(() => {
    if (data) {
      setTokens && setTokens(data.accessToken, data.refreshToken);
      const timeout = setTimeout(() => {
        navigate({
          to: "/dashboard",
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [data, navigate, setTokens]);

  return (
    <div className="h-svh">
      <div className="w-full py-32 container h-full flex flex-col space-y-14 justify-center">
        <div className="flex flex-col gap-4 max-w-96 mx-auto w-full">
          {isFetching ? (
            <div className="flex justify-center">
              <p className="text-center text-2xl font-bold">Logging in...</p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-2xl font-bold">Success!</p>
              <p className="text-center text-2xl font-bold">Redirecting...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-2xl font-bold">
                Your token is invalid, please log in again
              </p>
              <Button
                size="lg"
                className="mx-1 py-4 rounded-full w-full"
                variant="ghost"
                asChild
              >
                <Link to="/"> Log In</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TokenLogin;
