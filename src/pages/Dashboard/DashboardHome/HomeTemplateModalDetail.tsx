import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAPIMutationAuth, useAPIQueryAuth } from "@/lib/api.hooks";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { formatRFC3339 } from "date-fns";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useActiveWorkout } from "../DashboardActiveWorkout/activeWorkoutContext";
import {
  Set,
  Workout,
  WorkoutExercise,
} from "../DashboardActiveWorkout/activeWorkoutContext/type";
import { GetTemplate, GetTemplateDetail } from "./type";

type Props = {
  template: GetTemplate;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

function HomeTemplateModalDetail({ template, modalOpen, setModalOpen }: Props) {
  const navigate = useNavigate();
  const { setWorkout, isThereAnyActiveWorkout } = useActiveWorkout();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { token } = useAuth();
  const q = useQueryClient();
  const { toast } = useToast();
  const { data, isFetching } = useAPIQueryAuth<GetTemplateDetail>(
    `/gym/templates/${template.id}`,
    {
      queryKey: ["template", template.id],
      enabled: modalOpen,
    }
  );

  const { mutate: deleteTemplateMutate } = useAPIMutationAuth(
    `/gym/templates/${template.id}`,
    {
      method: "DELETE",
      onSuccess: () => {
        toast({
          title: "Deleted",
        });
        q.invalidateQueries({
          queryKey: ["templates", token],
        });
        setConfirmDelete(false);
        setModalOpen(true);
      },
    }
  );

  const deleteTemplate = () => {
    deleteTemplateMutate(null);
  };

  const startWorkout = () => {
    if (!isThereAnyActiveWorkout) {
      const workout: Workout | undefined = {
        name: template.name,
        created_at: formatRFC3339(new Date()),
        start_time: formatRFC3339(new Date()),
        end_time: "",
      };
      const workout_exercises: WorkoutExercise[] | undefined = [];
      const sets: Set[] | undefined = [];

      data?.workout_exercises.forEach((exercise) => {
        const we_id = uuid();
        workout_exercises.push({
          id: we_id,
          exercise_id: exercise.exercise_id,
          created_at: formatRFC3339(new Date()),
          exercise_details: {
            body_part: exercise.body_part_name,
            category: exercise.category_name,
            id: exercise.exercise_id,
            name: exercise.exercise_name,
            created_at: "",
            updated_at: "",
          },
          order_no: exercise.order_no,
        });

        exercise.sets.forEach((set) => {
          sets.push({
            workout_exercise_id: we_id,
            id: uuid(),
            created_at: formatRFC3339(new Date()),
            weight: set.weight ?? null,
            reps: set.reps ?? null,
            deducted_weight: set.deducted_weight ?? null,
            duration: set.duration ?? null,
            order_no: set.order_no,
            isDone: false,
          } as Set);
        });
      });

      setWorkout({
        workout,
        workout_exercises,
        sets,
        isTemplate: {
          isChangedExercises: false,
          isChangedSets: false,
          templateId: template.id,
        },
      });
      setModalOpen(false);
      navigate({
        to: "/dashboard/workouts/active",
      });
    }
  };

  return (
    <Dialog
      open={!isFetching && modalOpen}
      onOpenChange={(open) => setModalOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
        </DialogHeader>
        <div style={{ maxHeight: "70svh" }} className="overflow-y-auto">
          <div className="grid gap-4">
            {data?.workout_exercises.map((exercise) => (
              <div key={exercise.workout_exercise_id} className="grid gap-1">
                <p className="font-bold underline">{exercise.exercise_name}</p>
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
        <DialogFooter className="items-center !justify-between gap-3 mt-8">
          <div className="flex items-center">
            {!confirmDelete ? (
              <Button
                onClick={() => setConfirmDelete(true)}
                variant="ghost"
                className="text-red-700"
                size="sm"
              >
                Delete Template
              </Button>
            ) : (
              <Button
                onClick={deleteTemplate}
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
          </div>
          {!isThereAnyActiveWorkout && (
            <Button onClick={startWorkout}>Start Workout</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HomeTemplateModalDetail;
