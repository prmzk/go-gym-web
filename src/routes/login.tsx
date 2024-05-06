import TokenLogin from "@/pages/Auth/TokenLogin";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const tokenSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute("/login")({
  component: TokenLogin,
  validateSearch: (search) => tokenSchema.parse(search),
  onError: () => {
    throw redirect({ to: "/" });
  },
});
