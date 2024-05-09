import DashboardProfile from "@/pages/Dashboard/DashboardProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/profile")({
  component: DashboardProfile,
});
