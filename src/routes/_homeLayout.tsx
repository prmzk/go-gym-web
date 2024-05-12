import HomeLayout from "@/pages/Layouts/HomeLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_homeLayout")({
  beforeLoad: ({ context }) => {
    if (
      typeof context.auth?.isAuthenticated !== "undefined" &&
      context.auth?.isAuthenticated === true
    ) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: HomeLayout,
});
