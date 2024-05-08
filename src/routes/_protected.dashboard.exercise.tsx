import DashboardExercise from "@/pages/Dashboard/DashboardExercise/DashboardExercise";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

const exerciseSearchSchema = z.object({
  search: z.string().catch(""),
  category: z.string().catch("all"),
  bodyPart: z.string().catch("all"),
  orderBy: z.string().catch("name"),
});

export const Route = createFileRoute("/_protected/dashboard/exercise")({
  component: DashboardExercise,
  validateSearch: (search) => exerciseSearchSchema.parse(search),
});
