import DashboardHome from "@/pages/Dashboard/DashboardHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: DashboardHome,
});
