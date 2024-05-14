import { Workout } from "./DashboardActiveWorkout/activeWorkoutContext/type";

export type Exercise = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  category: string;
  body_part: string;

  rest_time?: number;
  notes?: string;
};

export type ExercisesData = {
  exercises: Exercise[];
};

export type GroupedExercisesData = {
  exercises: {
    [key: string]: Exercise[];
  };
};

export type ExerciseCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ExercisesCategoryData = {
  categories: ExerciseCategory[];
};

export type ExerciseBodyPart = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ExercisesBodyPartData = {
  body_parts: ExerciseBodyPart[];
};

export type FinishedWorkout = Workout & {
  id: string;
  updated_at: string;
};

export type FinishedWorkoutData = {
  workouts: FinishedWorkout[];
};

export type GetWorkoutDetail = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  start_time: string;
  end_time: string;
  workout_exercises: GetWorkoutExerciseDetail[];
};

export type GetWorkoutExerciseDetail = {
  workout_exercise_id: string;
  workout_exercise_created_at: string;
  workout_exercise_updated_at: string;
  exercise_id: string;
  exercise_name: string;
  category_name: string;
  body_part_name: string;
  sets: GetSetDetail[];
};

export type GetSetDetail = {
  set_id: string;
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
  set_created_at: string;
  set_updated_at: string;
};
