import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { useAPIMutation } from "@/lib/api.hooks";
import { Route } from "@/routes/_protected";
import { Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

const DashboardLayout = () => {
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const { mutate } = useAPIMutation<null>(`/users/logout`, {
    disableToast: true,
  });

  const logout = () => {
    mutate(null, {
      onSuccess: () => {
        mutate(null);
        auth.clearTokens && auth.clearTokens();
      },
    });
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate({
        to: "/",
      });
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="min-h-svh container py-4">
      <div className="flex py-4 justify-between">
        <div>
          <Link to="/dashboard">
            <img src="/NGA_inv.webp" alt="NGA" width={60} height={60} />
          </Link>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
