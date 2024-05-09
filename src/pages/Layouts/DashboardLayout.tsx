import { useAuth } from "@/lib/auth";
import NavigationItem from "@/components/NavigationItem";
import { Button } from "@/components/ui/button";
import { useAPIMutation } from "@/lib/api.hooks";
import { Route } from "@/routes/_protected";
import { Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

const DashboardLayout = () => {
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const { mutate, isPending } = useAPIMutation<null>(`/users/logout`, {
    disableToast: true,
    onSettled: () => {
      auth.logout && auth.logout(true);
    },
  });

  const logout = () => {
    mutate(null);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate({
        to: "/",
      });
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <>
      <div className="min-h-svh container max-w-[960px] px-2 py-4">
        <div className="flex py-4 justify-between items-center">
          <div className="shrink-0">
            <Link to="/dashboard">
              <img src="/NGA_inv.webp" alt="NGA" width={60} height={60} />
            </Link>
          </div>
          <Button variant="destructive" onClick={logout} disabled={isPending}>
            {isPending ? "Logging out.." : "Logout"}
          </Button>
        </div>
        <div className="pb-24">
          <Outlet />
        </div>
      </div>
      <ul className="w-full fixed z-10 bottom-0 h-16 flex items-center justify-center bg-black">
        {[
          { to: "/dashboard", icon: "➕", label: "Start" },
          { to: "/dashboard/workouts", icon: "🏋️‍♀️", label: "Workouts" },
          { to: "/dashboard/exercise", icon: "💪", label: "Exercise" },
          { to: "/dashboard/profile", icon: "🏃‍♂️", label: "Profile" },
        ].map((item) => (
          <NavigationItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </ul>
    </>
  );
};

export default DashboardLayout;
