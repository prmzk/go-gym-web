import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { formatRFC3339 } from "date-fns";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useActiveWorkout } from "../DashboardActiveWorkout/activeWorkoutContext";
import {
  PrevSet,
  Set,
  WorkoutExercise,
} from "../DashboardActiveWorkout/activeWorkoutContext/type";
import { Exercise } from "../types";

type Props = {
  exercise: Exercise;
};

const ExerciseCard = ({ exercise }: Props) => {
  const { isThereAnyActiveWorkout, setWorkout, workout } = useActiveWorkout();

  const { refetch: fetchPrevSet } = useAPIQueryAuth<PrevSet[]>(
    `/gym/workouts/previous-sets/${exercise.id}`,
    {
      queryKey: [
        "prev-exercise-set",
        exercise.id,
        workout?.workout?.created_at,
      ],
      enabled: false,
    }
  );

  const isFoundInWorkout = useMemo(() => {
    if (workout?.workout_exercises) {
      return workout.workout_exercises.some(
        (workout_exercise) => workout_exercise.exercise_id === exercise.id
      );
    }
    return false;
  }, [workout, exercise.id]);

  const addExerciseToWorkout = async () => {
    let workout_exercises: WorkoutExercise[] = [];
    if (workout?.workout_exercises) {
      workout_exercises = [...workout.workout_exercises];
    }

    let sets: Set[] = [];
    if (workout?.sets) {
      sets = [...workout.sets];
    }

    const { data } = await fetchPrevSet();
    const we_id = uuid();

    if (data && data?.length > 0) {
      data.forEach((prevSet) => {
        sets.push({
          id: uuid(),
          workout_exercise_id: we_id,
          created_at: formatRFC3339(new Date()),
          weight: prevSet.weight ?? null,
          reps: prevSet.reps ?? null,
          deducted_weight: prevSet.deducted_weight ?? null,
          duration: prevSet.duration ?? null,
          isDone: false,
          prevSet,
        });
      });
    }

    workout_exercises.push({
      id: we_id,
      exercise_id: exercise.id,
      created_at: formatRFC3339(new Date()),
      exercise_details: exercise,
    });

    setWorkout({
      ...workout,
      sets,
      workout_exercises,
    });
  };

  return (
    <Card className="py-4 px-2 rounded-none border-t-0 border-l-0 border-r-0 flex items-center justify-between cursor-pointer hover:brightness-50 ">
      <div>
        <p className="text-lg font-bold">{exercise.name}</p>
        <div className="*:capitalize flex gap-2 items-center">
          <p className="text-slate-300">{exercise.body_part}</p>
          <p className="text-slate-300 text-[4px]">⚪</p>
          <p className="text-slate-300">{exercise.category}</p>
        </div>
      </div>
      {isThereAnyActiveWorkout && !isFoundInWorkout && (
        <Button onClick={addExerciseToWorkout}>
          ➕ Add to current workout
        </Button>
      )}

      {isThereAnyActiveWorkout && isFoundInWorkout && (
        <div className="flex items-center">
          <Button variant="ghost" onClick={addExerciseToWorkout}>
            ➕ Add again
          </Button>
          <p>✅</p>
        </div>
      )}
    </Card>
  );
};

export default ExerciseCard;
