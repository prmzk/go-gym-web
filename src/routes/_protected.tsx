import {
  getActiveWorkoutStorage,
  removeActiveWorkoutStorage,
} from "@/pages/Dashboard/DashboardActiveWorkout/activeWorkoutContext/activeWorkoutStorage";
import DashboardLayout from "@/pages/Layouts/DashboardLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    if (
      typeof context.auth?.isAuthenticated !== "undefined" &&
      context.auth?.isAuthenticated === false
    ) {
      throw redirect({
        to: "/",
      });
    }
  },
  onLeave: () => {
    const activeWorkout = getActiveWorkoutStorage();
    if (activeWorkout) {
      removeActiveWorkoutStorage();
    }
  },
  component: DashboardLayout,
});
