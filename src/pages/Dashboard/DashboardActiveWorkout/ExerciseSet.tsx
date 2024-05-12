import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/lib/utils.hook";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveWorkout } from "./activeWorkoutContext";
import { LastSet, Set, WorkoutExercise } from "./activeWorkoutContext/type";
import { formatRFC3339 } from "date-fns";

type Props = {
  set: Set;
  index: number;
  exercise: WorkoutExercise;
  categoryProp: "weight" | "deducted_weight" | "reps" | "duration";
  categorySecondaryProp: "" | "reps";
  title: string;
  titleSecondary: string;
};

const ExerciseSet = ({
  set,
  index,
  exercise,
  categoryProp,
  categorySecondaryProp,
  titleSecondary,
}: Props) => {
  const { setWorkout, workout } = useActiveWorkout();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSecondary, setIsEditingSecondary] = useState(false);
  const [value, setValue] = useState(`${set[categoryProp]}`);
  const [valueSecondary, setValueSecondary] = useState(
    `${categorySecondaryProp ? set[categorySecondaryProp] : ""}`
  );
  const outsideRef = useOutsideClick(() => setIsEditing(false));
  const outsideRefSecondary = useOutsideClick(() =>
    setIsEditingSecondary(false)
  );
  const ref = useRef<HTMLInputElement | null>(null);
  const refSecondary = useRef<HTMLInputElement | null>(null);

  const removeSet = () => {
    let sets: Set[] = [];
    if (workout?.sets) {
      sets = [...workout.sets];
    }

    sets = sets.filter((setEl) => setEl.id !== set.id);

    setWorkout({
      ...workout,
      sets,
    });
  };

  const editSet = useCallback(
    (newVal: string) => {
      let sets: Set[] = [];
      if (workout?.sets) {
        sets = [...workout.sets];
      }

      const newSet = { ...set };
      newSet[categoryProp] = +newVal;

      const index = sets.findIndex((setEl) => setEl.id === set.id);
      if (index !== -1) {
        sets[index] = newSet;
      }

      setWorkout({
        ...workout,
        sets,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workout]
  );

  const editSetSecondary = useCallback(
    (newVal: string) => {
      let sets: Set[] = [];
      if (workout?.sets) {
        sets = [...workout.sets];
      }

      if (!categorySecondaryProp) return;

      const newSet = { ...set };
      newSet[categorySecondaryProp] = +newVal;

      const index = sets.findIndex((setEl) => setEl.id === set.id);
      if (index !== -1) {
        sets[index] = newSet;
      }

      setWorkout({
        ...workout,
        sets,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workout]
  );

  const doneUndoneSet = useCallback(() => {
    if (!+value && titleSecondary && !+valueSecondary) {
      return;
    } else if (!+value && !titleSecondary) {
      return;
    } else {
      let sets: Set[] = [];
      let lastSet: LastSet | null = null;
      if (workout?.sets) {
        sets = [...workout.sets];
      }

      const newSet = { ...set };
      const oldVal = newSet.isDone;
      newSet.isDone = !oldVal;

      if (newSet.isDone && exercise.exercise_details.rest_time) {
        lastSet = {
          exercise_name: exercise.exercise_details.name,
          rest_done: formatRFC3339(
            new Date(Date.now() + exercise.exercise_details.rest_time * 1000)
          ),
          rest_time: exercise.exercise_details.rest_time,
        };
      }

      const index = sets.findIndex((setEl) => setEl.id === set.id);
      if (index !== -1) {
        sets[index] = newSet;
      }

      setWorkout({
        ...workout,
        sets,
        lastSet: lastSet ? lastSet : workout?.lastSet,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout, titleSecondary, value, valueSecondary]);

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [isEditing, ref]);

  useEffect(() => {
    if (isEditingSecondary) {
      refSecondary.current?.focus();
      refSecondary.current?.select();
    }
  }, [isEditingSecondary, refSecondary]);

  return (
    <>
      <div className="flex my-2 gap-1" key={set.id}>
        <div className="w-6 md:w-12">
          <h2 className="font-bold text-lg text-center">{index + 1}</h2>
        </div>
        <div className="w-full min-h-6">
          <div className="grid grid-cols-3 gap-2 h-full">
            <div className="text-center col-span-1">
              {set?.prevSet ? (
                <p className="font-bold text-md">
                  {titleSecondary
                    ? `${set?.prevSet[categoryProp]}${categorySecondaryProp ? "x" + set?.prevSet[categorySecondaryProp] : ""}`
                    : set?.prevSet[categoryProp]}
                </p>
              ) : (
                <></>
              )}
            </div>
            <div
              className={cn(
                "text-center bg-gray-900 rounded-full cursor-pointer",
                !titleSecondary ? "col-span-2" : ""
              )}
              onClick={() => setIsEditing(true)}
              ref={outsideRef}
            >
              <div className="text-center">
                {!isEditing ? (
                  <p className="font-bold text-md">
                    {value === "0" ? "" : value}
                  </p>
                ) : (
                  <Input
                    ref={ref}
                    className="h-6 rounded-full ring-0 border-0 text-center"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value.replace(/^0+/, "") || "0");
                      editSet(e.target.value.replace(/^0+/, "") || "0");
                    }}
                    type="number"
                  />
                )}
              </div>
            </div>
            {titleSecondary ? (
              <div
                className="text-center bg-gray-900 rounded-full cursor-pointer"
                onClick={() => setIsEditingSecondary(true)}
                ref={outsideRefSecondary}
              >
                {!isEditingSecondary ? (
                  <p className="font-bold text-md">
                    {valueSecondary
                      ? valueSecondary === "0"
                        ? ""
                        : valueSecondary
                      : ""}
                  </p>
                ) : (
                  <Input
                    ref={refSecondary}
                    className="h-6 rounded-full ring-0 border-0 text-center"
                    value={valueSecondary}
                    onChange={(e) => {
                      setValueSecondary(
                        e.target.value.replace(/^0+/, "") || "0"
                      );
                      editSetSecondary(
                        e.target.value.replace(/^0+/, "") || "0"
                      );
                    }}
                    type="number"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "w-6 md:w-12 flex items-center justify-center cursor-pointer hover:bg-gray-900 rounded-full",
            set.isDone ? "bg-teal-400" : ""
          )}
          onClick={doneUndoneSet}
        >
          <CheckIcon className="h-5 w-5" />
        </div>
        <div
          className="w-6 md:w-12 flex items-center justify-center cursor-pointer hover:bg-red-900 rounded-full"
          onClick={removeSet}
        >
          <TrashIcon className="h-5 w-5" />
        </div>
      </div>
    </>
  );
};

export default ExerciseSet;
