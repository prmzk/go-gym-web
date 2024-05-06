import HomeLayout from "@/pages/Layouts/HomeLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_homeLayout")({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: HomeLayout,
});
