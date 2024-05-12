import NavigationItem from "@/components/NavigationItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAPIMutationAuth } from "@/lib/api.hooks";
import { useAuth } from "@/lib/auth";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DashboardActiveWorkoutIndicator from "../Dashboard/DashboardActiveWorkout/DashboardActiveWorkoutIndicator";
import ActiveWorkoutContextProvider from "../Dashboard/DashboardActiveWorkout/activeWorkoutContext/activeWorkoutContext";
import { getActiveWorkoutStorage } from "../Dashboard/DashboardActiveWorkout/activeWorkoutContext/activeWorkoutStorage";

function DashboardLayout() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const { mutate, isPending } = useAPIMutationAuth<null>(`/users/logout`, {
    disableToast: true,
    onSettled: () => {
      logout && logout(true);
      if (logoutOpen) setLogoutOpen(false);
    },
  });

  const logoutNow = () => {
    mutate(null);
  };

  const logoutBtn = () => {
    if (getActiveWorkoutStorage()) {
      setLogoutOpen(true);
      return;
    }
    logoutNow();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: "/",
      });
    }
  }, [isAuthenticated, navigate]);

  return (
    <ActiveWorkoutContextProvider>
      <div className="min-h-svh container max-w-[960px] px-2 py-4">
        <div className="flex py-4 justify-between items-center">
          <div className="shrink-0">
            <Link to="/dashboard">
              <img src="/NGA_inv.webp" alt="NGA" width={60} height={60} />
            </Link>
          </div>
          <Button
            variant="ghost"
            onClick={logoutBtn}
            disabled={isPending}
            className="text-sm"
          >
            {isPending ? "Logging out.." : "Logout"}
          </Button>
        </div>
        <div className="pb-24">
          <Outlet />
        </div>
      </div>
      <div className="w-full fixed z-10 bottom-0 bg-black">
        <div className="bg-teal-500">
          <DashboardActiveWorkoutIndicator />
        </div>
        <ul className="h-16 flex items-center justify-center">
          {[
            { to: "/dashboard", icon: "➕", label: "Start" },
            { to: "/dashboard/workouts", icon: "🏋️‍♀️", label: "Workouts" },
            { to: "/dashboard/exercise", icon: "💪", label: "Exercise" },
            { to: "/dashboard/profile", icon: "🏃‍♂️", label: "Profile" },
          ].map((item) => (
            <NavigationItem
              key={item.icon}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </ul>
      </div>
      <Dialog open={logoutOpen} onOpenChange={(open) => setLogoutOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You have active exercise</DialogTitle>
            <DialogDescription>
              All your progress will be lost if you logout now
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button onClick={logoutNow} variant="destructive">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ActiveWorkoutContextProvider>
  );
}

export default DashboardLayout;
