import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAPIMutationAuth } from "@/lib/api.hooks";
import { formatRFC3339 } from "date-fns";
import { useActiveWorkout } from "./activeWorkoutContext";
import { ActiveWorkout } from "./activeWorkoutContext/type";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  finishOpen: boolean;
  setFinishOpen: (finishOpen: boolean) => void;
};

function FinishWorkout({ finishOpen, setFinishOpen }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmMode, setConfirmMode] = useState(false);
  const { workout, deleteActiveWorkout, setWorkout } = useActiveWorkout();
  const [normalizedWorkout, setNormalizedWorkout] =
    useState<ActiveWorkout | null>(workout);

  const { mutateAsync: updateTemplate } = useAPIMutationAuth<
    ActiveWorkout,
    null
  >(`/gym/templates/change-sets/${workout?.isTemplate?.templateId}`, {});

  const { mutateAsync: updateTemplateValues } = useAPIMutationAuth<
    ActiveWorkout,
    null
  >(`/gym/templates/change-values/${workout?.isTemplate?.templateId}`, {});

  const { mutate } = useAPIMutationAuth<ActiveWorkout, null>("/gym/workouts", {
    onSuccess: () => {
      deleteActiveWorkout();
      setWorkout(null);
      navigate({ to: "/dashboard" });
    },
  });

  const handleSend = async ({ saveTemplate }: { saveTemplate?: boolean }) => {
    if (normalizedWorkout && normalizedWorkout?.workout) {
      if (
        normalizedWorkout.workout_exercises?.length === 0 ||
        normalizedWorkout.sets?.length === 0
      ) {
        toast({
          variant: "destructive",
          title: "Unfinished workout",
        });
        return;
      }

      const toSend = {
        ...normalizedWorkout,
        workout: {
          ...normalizedWorkout.workout,
          end_time: formatRFC3339(new Date()),
        },
      };

      if (saveTemplate) {
        await updateTemplate(toSend);
      } else {
        await updateTemplateValues(toSend);
      }
      mutate(toSend);
      setFinishOpen(false);
    }
  };

  useEffect(() => {
    if (workout) {
      let newNormalized: ActiveWorkout = {
        ...workout,
        sets: [],
        workout_exercises: [],
      };
      // filter undone sets
      const filteredSets = workout.sets?.filter((set) => set?.isDone === true);
      // order sets based on workout_exercise_id
      const set_temp: { [key: string]: number } = {};
      filteredSets?.forEach((set, i) => {
        if (!set_temp[set.workout_exercise_id]) {
          set_temp[set.workout_exercise_id] = 1;
        } else {
          set_temp[set.workout_exercise_id] =
            set_temp[set.workout_exercise_id] + 1;
        }

        filteredSets[i] = {
          ...set,
          order_no: set_temp[set.workout_exercise_id],
        };
      });

      newNormalized = {
        ...newNormalized,
        sets: filteredSets,
      };

      // filter workout exercise without done sets
      const filteredWorkoutExercises = workout.workout_exercises?.filter(
        (workoutExercise) =>
          newNormalized?.sets?.filter(
            (set) => set?.workout_exercise_id === workoutExercise?.id
          )?.length ?? 0 > 0
      );
      filteredWorkoutExercises?.forEach((set, i) => {
        filteredWorkoutExercises[i] = {
          ...set,
          order_no: i + 1,
        };
      });

      newNormalized = {
        ...newNormalized,
        workout_exercises: filteredWorkoutExercises,
      };

      setNormalizedWorkout(newNormalized);
    }
  }, [workout]);

  return (
    <Dialog open={finishOpen} onOpenChange={(open) => setFinishOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recap your workout</DialogTitle>
        </DialogHeader>
        {!confirmMode ? (
          <>
            <div className="max-h-svh overflow-y-auto py-4 flex flex-col gap-1 items-center">
              {!normalizedWorkout?.workout_exercises?.length ||
              !normalizedWorkout?.sets?.length
                ? "You havent done any exercises yet!"
                : ""}
              {normalizedWorkout?.workout_exercises?.map((exercise, index) => (
                <div key={index} className="flex gap-1 items-center">
                  <p>{exercise.exercise_details.name}</p>
                  <p>x</p>
                  <p>
                    {
                      normalizedWorkout?.sets?.filter(
                        (set) => set?.workout_exercise_id === exercise.id
                      ).length
                    }{" "}
                    sets
                  </p>
                </div>
              ))}
            </div>
            <DialogFooter className="mx-auto mt-4 gap-3">
              <Button variant="ghost" onClick={() => setFinishOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (workout?.isTemplate?.isChangedExercises) {
                    setConfirmMode(true);
                  } else {
                    handleSend({ saveTemplate: false });
                  }
                }}
                disabled={
                  !normalizedWorkout?.workout_exercises?.length ||
                  !normalizedWorkout?.sets?.length
                }
              >
                Finish workout
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="grid gap-4 my-8">
            <Button onClick={() => handleSend({ saveTemplate: true })}>
              Save New Template
            </Button>
            <Button onClick={() => handleSend({ saveTemplate: false })}>
              Save Values Only
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FinishWorkout;
