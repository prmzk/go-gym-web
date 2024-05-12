import { ActiveWorkout, Set, WorkoutExercise } from "./type";

export const activeWorkoutKey = "activeWorkout";

export const generateActiveWorkout = ({
  name,
  start_time,
  created_at,
}: {
  name: string;
  start_time: string;
  created_at: string;
}): ActiveWorkout => {
  return {
    workout: {
      name,
      start_time,
      created_at,
      end_time: "",
    },
    workout_exercises: [],
    sets: [],
  };
};

export function getActiveWorkoutStorage() {
  return localStorage.getItem(activeWorkoutKey);
}

export function removeActiveWorkoutStorage() {
  localStorage.removeItem(activeWorkoutKey);
}

export function setActiveWorkoutStorage(activeWorkout: string) {
  localStorage.setItem(activeWorkoutKey, activeWorkout);
}

export function isSatisfiesActiveWorkoutType(
  activeWorkout: unknown
): activeWorkout is ActiveWorkout {
  return (
    typeof activeWorkout === "object" &&
    (activeWorkout || false) &&
    "workout" in activeWorkout &&
    "workout_exercises" in activeWorkout &&
    "sets" in activeWorkout &&
    typeof activeWorkout.workout === "object" &&
    (activeWorkout.workout || false) &&
    "name" in activeWorkout.workout &&
    "start_time" in activeWorkout.workout &&
    "end_time" in activeWorkout.workout &&
    "created_at" in activeWorkout.workout &&
    Array.isArray(activeWorkout.workout_exercises) &&
    Array.isArray(activeWorkout.sets) &&
    activeWorkout.workout_exercises.every(isWorkoutExercise) &&
    activeWorkout.sets.every(isSet)
  );
}

export function isWorkoutExercise(
  workout_exercise: unknown
): workout_exercise is WorkoutExercise {
  return (
    typeof workout_exercise === "object" &&
    (workout_exercise || false) &&
    "id" in workout_exercise &&
    "exercise_id" in workout_exercise &&
    "created_at" in workout_exercise
  );
}

export function isSet(set: unknown): set is Set {
  return (
    typeof set === "object" &&
    (set || false) &&
    "workout_exercise_id" in set &&
    "id" in set &&
    "created_at" in set &&
    "weight" in set &&
    "reps" in set &&
    "deducted_weight" in set &&
    "duration" in set
  );
}
