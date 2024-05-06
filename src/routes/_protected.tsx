import DashboardLayout from "@/pages/Layouts/DashboardLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: DashboardLayout,
});
