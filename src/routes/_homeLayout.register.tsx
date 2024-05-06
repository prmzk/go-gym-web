import RegisterForm from "@/pages/Auth/Register";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_homeLayout/register")({
  component: RegisterForm,
});
