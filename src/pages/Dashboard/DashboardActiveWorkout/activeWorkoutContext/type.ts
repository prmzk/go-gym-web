import { Exercise } from "../../types";

export interface IActiveWorkoutContext {
  isThereAnyActiveWorkout: boolean;
  deleteActiveWorkout: () => void;
  workout: ActiveWorkout | null;
  setWorkout: (workout: ActiveWorkout | null) => void;
}

export type LastSet = {
  exercise_name: string;
  rest_done: string;
  rest_time: number;
};

export type ActiveWorkout = {
  workout?: Workout;
  workout_exercises?: WorkoutExercise[];
  sets?: Set[];
  lastSet?: LastSet;
};

export type Workout = {
  name: string;
  start_time: string;
  created_at: string;
  end_time: string;
};

export type WorkoutExercise = {
  id: string;
  exercise_id: string;
  created_at: string;
  exercise_details: Exercise;
};

export type Set = {
  workout_exercise_id: string;
  id: string;
  created_at: string;
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
  isDone: boolean;
  prevSet?: PrevSet;
};

export type PrevSet = {
  weight: number | null;
  reps: number | null;
  deducted_weight: number | null;
  duration: number | null;
};

export type EditExerciseUserInput = {
  rest_time?: number;
  notes?: string;
};
