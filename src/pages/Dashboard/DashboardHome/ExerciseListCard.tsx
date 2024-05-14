import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAPIMutationAuth } from "@/lib/api.hooks";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  GearIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { EditExerciseUserInput } from "../DashboardActiveWorkout/activeWorkoutContext/type";
import { SetTemplate, Template, WorkoutExerciseTemplate } from "./type";
import ExerciseSets from "./ExerciseSets";

type Props = {
  exercise: WorkoutExerciseTemplate;
  template: Template | null;
  setTemplate: (template: Template | null) => void;
};

const ExerciseListCard = ({ exercise, setTemplate, template }: Props) => {
  const [notes] = useState(exercise?.exercise_details.notes || "");
  const [restTime, setRestTime] = useState(
    exercise?.exercise_details.rest_time || 0
  );
  const [restTimeModalOpen, setRestTimeModalOpen] = useState(false);

  const removeExerciseWorkout = () => {
    let workout_exercises: WorkoutExerciseTemplate[] = [];
    if (template?.workout_exercises) {
      workout_exercises = [...template.workout_exercises];
    }

    let sets: SetTemplate[] = [];
    if (template?.sets) {
      sets = [...template.sets];
    }

    workout_exercises = workout_exercises.filter(
      (workout_exercise) => workout_exercise.id !== exercise.id
    );

    sets = sets.filter((set) => set.template_exercise_id !== exercise.id);

    setTemplate({
      ...template,
      workout_exercises,
      sets,
    });
  };

  const moveUpExerciseWorkout = () => {
    let workout_exercises: WorkoutExerciseTemplate[] = [];
    if (template?.workout_exercises) {
      workout_exercises = [...template.workout_exercises];
    }

    const index = workout_exercises.findIndex(
      (workout_exercise) => workout_exercise.id === exercise.id
    );

    if (index === 0) return;

    const temp = workout_exercises[index];
    workout_exercises[index] = workout_exercises[index - 1];
    workout_exercises[index - 1] = temp;

    setTemplate({
      ...template,
      workout_exercises,
    });
  };

  const moveDownExerciseWorkout = () => {
    let workout_exercises: WorkoutExerciseTemplate[] = [];
    if (template?.workout_exercises) {
      workout_exercises = [...template.workout_exercises];
    }

    const index = workout_exercises.findIndex(
      (workout_exercise) => workout_exercise.id === exercise.id
    );

    if (index === workout_exercises.length - 1) return;

    const temp = workout_exercises[index];
    workout_exercises[index] = workout_exercises[index + 1];
    workout_exercises[index + 1] = temp;

    setTemplate({
      ...template,
      workout_exercises,
    });
  };

  const { mutate } = useAPIMutationAuth(
    `/gym/exercises/workout-user/${exercise.exercise_id}`,
    {}
  );
  const handleEditExerciseUser = () => {
    const inputData: EditExerciseUserInput = {};
    if (notes) inputData.notes = notes;
    if (restTime) inputData.rest_time = restTime;

    let workout_exercises: WorkoutExerciseTemplate[] = [];
    if (template?.workout_exercises) {
      workout_exercises = [...template.workout_exercises];
    }

    workout_exercises.forEach((workout_exercise) => {
      if (workout_exercise.exercise_id === exercise.exercise_id) {
        workout_exercise.exercise_details = {
          ...workout_exercise.exercise_details,
          ...inputData,
        };
      }
    });

    setTemplate({
      ...template,
      workout_exercises,
    });

    mutate(inputData);
  };

  return (
    <>
      <Card className="py-4 px-2 rounded-none border-0">
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <div>
            <p className="text-xl font-bold">
              {exercise.exercise_details.name}
            </p>
            <div className="*:capitalize flex gap-2 items-center">
              <p className="text-slate-300">
                {exercise.exercise_details.body_part}
              </p>
              <p className="text-slate-300 text-[4px]">⚪</p>
              <p className="text-slate-300">
                {exercise.exercise_details.category}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 h-8 hover:backdrop-brightness-150 flex items-center justify-center">
              <GearIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={removeExerciseWorkout}>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveUpExerciseWorkout}>
                <ArrowUpIcon className="mr-2 h-4 w-4" />
                <span>Move up</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveDownExerciseWorkout}>
                <ArrowDownIcon className="mr-2 h-4 w-4" />
                <span>Move down</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRestTimeModalOpen(true)}>
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>Set Cooldown</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ExerciseSets
          exercise={exercise}
          setTemplate={setTemplate}
          template={template}
        />
      </Card>

      <Dialog
        open={restTimeModalOpen}
        onOpenChange={(open) => setRestTimeModalOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Workout Cooldown</DialogTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder={restTime.toString()}
                className="text-lg h-12 my-4 rounded-lg"
                onChange={(e) =>
                  setRestTime(+(e.target.value.replace(/^0+/, "") || "0"))
                }
                value={restTime}
              />
              <p>Second</p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button onClick={() => setRestTimeModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEditExerciseUser();
                setRestTimeModalOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseListCard;
