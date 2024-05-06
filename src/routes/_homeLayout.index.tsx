import LogInForm from "@/pages/Auth/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_homeLayout/")({
  component: LogInForm,
});
