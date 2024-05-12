import DashboardActiveWorkout from "@/pages/Dashboard/DashboardActiveWorkout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/workouts/active")({
  component: DashboardActiveWorkout,
});
