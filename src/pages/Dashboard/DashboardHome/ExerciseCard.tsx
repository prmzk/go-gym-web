import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { Exercise } from "../types";
import {
  PrevSet,
  SetTemplate,
  Template,
  WorkoutExerciseTemplate,
} from "./type";
import { v4 as uuid } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";

type Props = {
  exercise: Exercise;
  template: Template | null;
  setTemplate: (template: Template | null) => void;
};

function ExerciseCard({ exercise, setTemplate, template }: Props) {
  const { toast } = useToast();
  const { refetch: fetchPrevSet } = useAPIQueryAuth<PrevSet[]>(
    `/gym/workouts/previous-sets/${exercise.id}`,
    {
      queryKey: [
        "prev-exercise-set",
        exercise.id,
        "template",
        template?.workout?.name,
      ],
      enabled: false,
    }
  );

  const isFoundInWorkout = useMemo(() => {
    if (template?.workout_exercises) {
      return template.workout_exercises.some(
        (workout_exercise) => workout_exercise.exercise_id === exercise.id
      );
    }
    return false;
  }, [template, exercise.id]);

  const addExerciseToTemplate = async () => {
    try {
      let workout_exercises: WorkoutExerciseTemplate[] = [];
      if (template?.workout_exercises) {
        workout_exercises = [...template.workout_exercises];
      }

      let sets: SetTemplate[] = [];
      if (template?.sets) {
        sets = [...template.sets];
      }

      const { data } = await fetchPrevSet();
      const we_id = uuid();

      if (data && data?.length > 0) {
        data.forEach((prevSet) => {
          sets.push({
            id: uuid(),
            template_exercise_id: we_id,
            weight: prevSet.weight ?? null,
            reps: prevSet.reps ?? null,
            deducted_weight: prevSet.deducted_weight ?? null,
            duration: prevSet.duration ?? null,
            order_no: prevSet.order_no,
            prevSet,
          });
        });
      }

      const order_no = workout_exercises.length
        ? workout_exercises[workout_exercises.length - 1].order_no + 1
        : 1;

      workout_exercises.push({
        id: we_id,
        exercise_id: exercise.id,
        exercise_details: exercise,
        order_no,
      });

      setTemplate({
        ...template,
        sets,
        workout_exercises,
      });

      toast({
        title: "Added.",
      });
    } catch {
      toast({
        title: "Failed. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      key={exercise.id}
      className="py-4 px-2 rounded-none border-t-0 border-l-0 border-r-0 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4"
    >
      <div>
        <p className="text-lg font-bold">{exercise.name}</p>
        <div className="*:capitalize flex gap-2 items-center">
          <p className="text-slate-300">{exercise.body_part}</p>
          <p className="text-slate-300 text-[4px]">⚪</p>
          <p className="text-slate-300">{exercise.category}</p>
        </div>
      </div>
      {!isFoundInWorkout && (
        <Button onClick={addExerciseToTemplate}>➕ Add to template</Button>
      )}

      {isFoundInWorkout && (
        <div className="flex items-center">
          <Button variant="ghost" onClick={addExerciseToTemplate}>
            ➕ Add again
          </Button>
          <p>✅</p>
        </div>
      )}
    </Card>
  );
}

export default ExerciseCard;
