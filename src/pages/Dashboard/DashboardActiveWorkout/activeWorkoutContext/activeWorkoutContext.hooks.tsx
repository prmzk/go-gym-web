import { useContext } from "react";
import { ActiveWorkoutContext } from "./activeWorkoutContext";

export function useActiveWorkout() {
  const context = useContext(ActiveWorkoutContext);
  if (!context) {
    throw new Error(
      "useActiveWorkout must be used within an ActiveWorkoutProvider"
    );
  }
  return context;
}
