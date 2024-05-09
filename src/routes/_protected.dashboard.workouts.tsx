import DashboardWorkouts from "@/pages/Dashboard/DashboardWorkouts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/workouts")({
  component: DashboardWorkouts,
});
