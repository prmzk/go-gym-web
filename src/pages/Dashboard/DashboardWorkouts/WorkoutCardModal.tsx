import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { format } from "date-fns";
import { FinishedWorkout, WorkoutDetail } from "../types";

type Props = {
  workout: FinishedWorkout;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

function WorkoutCardModal({ workout, modalOpen, setModalOpen }: Props) {
  const { data, isFetching } = useAPIQueryAuth<WorkoutDetail>(
    `/gym/workouts/${workout.id}`,
    {
      queryKey: ["workouts", workout.id],
      enabled: modalOpen,
    }
  );

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{workout.name}</DialogTitle>
          <DialogDescription>
            {format(workout.start_time, "EEEE, d MMMM yyyy 'at' HH:mm")}
          </DialogDescription>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          {isFetching ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4">
              {data?.workout_exercises.map((exercise) => (
                <div key={exercise.workout_exercise_id} className="grid gap-1">
                  <p>{exercise.exercise_name}</p>
                  <div className="grid gap-2">
                    {exercise.sets.map((set) => (
                      <div key={set.set_id} className="flex items-center gap-2">
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
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setModalOpen(false)} variant="ghost">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WorkoutCardModal;
