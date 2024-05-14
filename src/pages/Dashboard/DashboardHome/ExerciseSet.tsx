import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/lib/utils.hook";
import { TrashIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { SetTemplate, Template, WorkoutExerciseTemplate } from "./type";

type Props = {
  set: SetTemplate;
  index: number;
  exercise: WorkoutExerciseTemplate;
  categoryProp: "weight" | "deducted_weight" | "reps" | "duration";
  categorySecondaryProp: "" | "reps";
  title: string;
  titleSecondary: string;

  template: Template | null;
  setTemplate: (template: Template | null) => void;
};

const ExerciseSet = ({
  set,
  index,
  categoryProp,
  categorySecondaryProp,
  titleSecondary,
  setTemplate,
  template,
}: Props) => {
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
    let sets: SetTemplate[] = [];
    if (template?.sets) {
      sets = [...template.sets];
    }

    sets = sets.filter((setEl) => setEl.id !== set.id);

    setTemplate({
      ...template,
      sets,
    });
  };

  const editSet = useCallback(
    (newVal: string) => {
      let sets: SetTemplate[] = [];
      if (template?.sets) {
        sets = [...template.sets];
      }

      const newSet = { ...set };
      newSet[categoryProp] = +newVal;

      const index = sets.findIndex((setEl) => setEl.id === set.id);
      if (index !== -1) {
        sets[index] = newSet;
      }

      setTemplate({
        ...template,
        sets,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template]
  );

  const editSetSecondary = useCallback(
    (newVal: string) => {
      let sets: SetTemplate[] = [];
      if (template?.sets) {
        sets = [...template.sets];
      }

      if (!categorySecondaryProp) return;

      const newSet = { ...set };
      newSet[categorySecondaryProp] = +newVal;

      const index = sets.findIndex((setEl) => setEl.id === set.id);
      if (index !== -1) {
        sets[index] = newSet;
      }

      setTemplate({
        ...template,
        sets,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template]
  );

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
                    ? `${set?.prevSet[categoryProp] ?? "0"}${categorySecondaryProp ? "x" + set?.prevSet[categorySecondaryProp] : ""}`
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
                    {value === "0" || value === "null" ? "" : value}
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
                      ? valueSecondary === "0" || valueSecondary === "null"
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
          className="w-8 md:w-12 flex items-center justify-center cursor-pointer hover:bg-red-900 rounded-full shrink-0"
          onClick={removeSet}
        >
          <TrashIcon className="h-5 w-5" />
        </div>
      </div>
    </>
  );
};

export default ExerciseSet;
