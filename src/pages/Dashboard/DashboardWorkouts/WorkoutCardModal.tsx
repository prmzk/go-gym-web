import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogContentSpinner,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAPIMutationAuth, useAPIQueryAuth } from "@/lib/api.hooks";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { FinishedWorkout, WorkoutDetail } from "../types";

type Props = {
  workout: FinishedWorkout;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

function WorkoutCardModal({ workout, modalOpen, setModalOpen }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { token } = useAuth();
  const q = useQueryClient();
  const { toast } = useToast();
  const { data, isFetching } = useAPIQueryAuth<WorkoutDetail>(
    `/gym/workouts/${workout.id}`,
    {
      queryKey: ["workouts", workout.id],
      enabled: modalOpen,
    }
  );

  const { mutate: deleteWorkoutMutate } = useAPIMutationAuth(
    `/gym/workouts/${workout.id}`,
    {
      method: "DELETE",
      onSuccess: () => {
        toast({
          title: "Deleted",
        });
        q.invalidateQueries({
          queryKey: ["workouts", "all", token],
        });
        setConfirmDelete(false);
      },
    }
  );

  const deleteWorkout = () => {
    deleteWorkoutMutate(null);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
      {!isFetching ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{workout.name}</DialogTitle>
            <DialogDescription>
              {format(workout.start_time, "EEEE, d MMMM yyyy 'at' HH:mm")}
            </DialogDescription>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div style={{ maxHeight: "70svh" }} className="overflow-y-auto">
            <div className="grid gap-4">
              {data?.workout_exercises.map((exercise) => (
                <div key={exercise.workout_exercise_id} className="grid gap-1">
                  <p className="font-bold underline">
                    {exercise.exercise_name}
                  </p>
                  <div className="grid gap-2">
                    {exercise.sets.map((set) => (
                      <div key={set.set_id} className="flex items-center gap-1">
                        {set.weight ? <p>{set.weight} Kg</p> : null}
                        {set.deducted_weight ? (
                          <p>-{set.deducted_weight} Kg</p>
                        ) : null}
                        {!set.weight && !set.deducted_weight && set.reps ? (
                          <p>{set.reps} Reps</p>
                        ) : null}
                        {set.duration ? <p>{set.duration}</p> : null}
                        {set.weight ? <p>x</p> : null}
                        <p>{set.weight && set.reps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="items-center justify-between">
            {!confirmDelete ? (
              <Button
                onClick={() => setConfirmDelete(true)}
                variant="ghost"
                className="text-red-700"
                size="sm"
              >
                Delete Workout
              </Button>
            ) : (
              <Button
                onClick={deleteWorkout}
                variant="ghost"
                className="text-red-700"
                size="sm"
              >
                Click this button again to confirm
              </Button>
            )}
            <Button onClick={() => setModalOpen(false)} variant="ghost">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContentSpinner />
      )}
    </Dialog>
  );
}

export default WorkoutCardModal;
