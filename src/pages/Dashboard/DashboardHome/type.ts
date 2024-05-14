import { LastSet } from "../DashboardActiveWorkout/activeWorkoutContext/type";
import { Exercise } from "../types";

export type Template = {
  workout?: WorkoutTemplate;
  workout_exercises?: WorkoutExerciseTemplate[];
  sets?: SetTemplate[];
  lastSet?: LastSet;
};

export type WorkoutTemplate = {
  name: string;
};

export type WorkoutExerciseTemplate = {
  id: string;
  exercise_id: string;
  exercise_details: Exercise;
  order_no: number;
};

export type SetTemplate = {
  template_exercise_id: string;
  id: string;
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
  prevSet?: PrevSet;
  order_no: number;
};

export type PrevSet = {
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
  order_no: number;
};

export type GetTemplateDetail = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  workout_exercises: GetTemplateWorkoutExerciseDetail[];
};

export type GetTemplateWorkoutExerciseDetail = {
  workout_exercise_id: string;
  workout_exercise_created_at: string;
  workout_exercise_updated_at: string;
  exercise_id: string;
  exercise_name: string;
  category_name: string;
  body_part_name: string;
  sets: GetSetTemplateDetail[];
  order_no: number;
};

export type GetSetTemplateDetail = {
  set_id: string;
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
  set_created_at: string;
  set_updated_at: string;
  order_no: number;
};

export type GetTemplate = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type TemplatesData = {
  workouts: GetTemplate[];
};
