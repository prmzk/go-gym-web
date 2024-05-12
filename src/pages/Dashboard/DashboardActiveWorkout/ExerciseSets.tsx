import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRFC3339 } from "date-fns";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useActiveWorkout } from "./activeWorkoutContext";
import { Set, WorkoutExercise } from "./activeWorkoutContext/type";
import ExerciseSet from "./ExerciseSet";
import {
  categoryAddSet,
  categoryProps,
  categorySecondaryProps,
  categorySecondaryTitle,
  categoryTitle,
  CategoryTitle,
} from "./ExerciseSet.utils";

type Props = {
  exercise: WorkoutExercise;
};

const ExerciseSets = ({ exercise }: Props) => {
  const { setWorkout, workout } = useActiveWorkout();

  const categoryProp = useMemo(
    () =>
      categoryProps[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ],
    [exercise?.exercise_details?.category]
  );
  const categorySecondaryProp = useMemo(
    () =>
      categorySecondaryProps[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ],
    [exercise?.exercise_details?.category]
  );
  const title = useMemo(
    () =>
      categoryTitle[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ],
    [exercise?.exercise_details?.category]
  );
  const titleSecondary = useMemo(
    () =>
      categorySecondaryTitle[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ],
    [exercise?.exercise_details?.category]
  );

  const exerciseSet = useMemo(() => {
    return workout?.sets?.filter(
      (set) => set.workout_exercise_id === exercise.id
    );
  }, [workout, exercise.id]);

  const addSet = () => {
    let sets: Set[] = [];
    if (workout?.sets) {
      sets = [...workout.sets];
    }

    let newSet;

    if (!exerciseSet?.length) {
      newSet = categoryAddSet[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ]({});
    } else {
      newSet = exerciseSet[exerciseSet.length - 1];
    }

    sets.push({
      ...newSet,
      id: uuid(),
      workout_exercise_id: exercise.id,
      created_at: formatRFC3339(new Date()),
      isDone: false,
    });

    setWorkout({
      ...workout,
      sets,
    });
  };

  return (
    <div>
      <div className="flex gap-1">
        <div className="w-6 md:w-12">
          <h2 className="font-bold text-lg text-center">Set</h2>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center col-span-1">
              <p className="font-bold text-md">Previous</p>
            </div>
            <div
              className={cn("text-center", !titleSecondary ? "col-span-2" : "")}
            >
              <div className="text-center">
                <p className="font-bold text-md">{title}</p>
              </div>
            </div>
            {titleSecondary ? (
              <div className="text-center">
                <p className="font-bold text-md">{titleSecondary}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-6 md:w-12 flex items-center justify-center">
          <div className="h-5 w-5"></div>
        </div>
        <div className="w-6 md:w-12 flex items-center justify-center">
          <div className="h-5 w-5"></div>
        </div>
      </div>
      <div className="transition-all">
        {exerciseSet?.map((set, i) => (
          <ExerciseSet
            key={set.id}
            set={set}
            exercise={exercise}
            index={i}
            categoryProp={categoryProp}
            categorySecondaryProp={categorySecondaryProp}
            title={title}
            titleSecondary={titleSecondary}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-4">
        <Button
          className="w-3/5 rounded-full"
          variant="default"
          size="sm"
          onClick={addSet}
        >
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default ExerciseSets;
