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
  const { workout, deleteActiveWorkout, setWorkout } = useActiveWorkout();
  const [normalizedWorkout, setNormalizedWorkout] =
    useState<ActiveWorkout | null>(workout);

  const { mutate } = useAPIMutationAuth<ActiveWorkout, null>("/gym/workouts", {
    onSuccess: () => {
      deleteActiveWorkout();
      setWorkout(null);
      navigate({ to: "/dashboard" });
    },
  });

  const handleSend = () => {
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

      mutate({
        ...normalizedWorkout,
        workout: {
          ...normalizedWorkout.workout,
          end_time: formatRFC3339(new Date()),
        },
      });

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
      newNormalized = {
        ...newNormalized,
        sets: filteredSets,
      };

      //   filter workout exercise without done sets
      const filteredWorkoutExercises = workout.workout_exercises?.filter(
        (workoutExercise) =>
          newNormalized?.sets?.filter(
            (set) => set?.workout_exercise_id === workoutExercise?.id
          )?.length ?? 0 > 0
      );

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
          <div className="max-h-svh overflow-y-auto py-4 flex flex-col gap-1">
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
        </DialogHeader>
        <DialogFooter className="mx-auto mt-4">
          <Button variant="ghost" onClick={() => setFinishOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Finish workout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FinishWorkout;
