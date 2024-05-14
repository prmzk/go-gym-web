import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import {
  categoryAddSet,
  categoryProps,
  categorySecondaryProps,
  categorySecondaryTitle,
  categoryTitle,
  CategoryTitle,
} from "../DashboardActiveWorkout/ExerciseSet.utils";
import { SetTemplate, Template, WorkoutExerciseTemplate } from "./type";
import ExerciseSet from "./ExerciseSet";

type Props = {
  exercise: WorkoutExerciseTemplate;
  template: Template | null;
  setTemplate: (template: Template | null) => void;
};

const ExerciseSets = ({ exercise, setTemplate, template }: Props) => {
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
    return template?.sets?.filter(
      (set) => set.template_exercise_id === exercise.id
    );
  }, [template, exercise.id]);

  const addSet = () => {
    let sets: SetTemplate[] = [];
    if (template?.sets) {
      sets = [...template.sets];
    }

    let newSet;

    if (!exerciseSet?.length) {
      newSet = categoryAddSet[
        exercise?.exercise_details?.category as keyof CategoryTitle
      ]({});
    } else {
      newSet = exerciseSet[exerciseSet.length - 1];
    }

    const order_no = sets.length ? sets[sets.length - 1].order_no + 1 : 1;

    sets.push({
      ...newSet,
      id: uuid(),
      template_exercise_id: exercise.id,
      order_no,
    });

    setTemplate({
      ...template,
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
        <div className="w-8 shrink-0 md:w-12 flex items-center justify-center">
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
            setTemplate={setTemplate}
            template={template}
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
