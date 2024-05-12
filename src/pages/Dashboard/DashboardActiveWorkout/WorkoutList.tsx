import { useActiveWorkout } from "./activeWorkoutContext";
import ExerciseCard from "./ExerciseCard";

function WorkoutList() {
  const { workout } = useActiveWorkout();

  if (!workout?.workout_exercises) return null;

  return (
    <div>
      {workout?.workout_exercises.map((workout_exercise) => (
        <div key={workout_exercise.id}>
          <ExerciseCard exercise={workout_exercise} />
        </div>
      ))}
    </div>
  );
}

export default WorkoutList;
