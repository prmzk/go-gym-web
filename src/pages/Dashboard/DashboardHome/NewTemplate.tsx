import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Template } from "./type";
import ExerciseModal from "./ExerciseModal";
import ExerciseListCard from "./ExerciseListCard";
import { useAPIMutationAuth } from "@/lib/api.hooks";
import { useQueryClient } from "@tanstack/react-query";

function NewTemplate() {
  const ref = useRef<HTMLInputElement | null>(null);
  const q = useQueryClient();
  const [modalOpenExercise, setModalOpenExercise] = useState(false);
  const [modalOpenName, setModalOpenName] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const [template, setTemplate] = useState<Template | null>(null);
  const [templateNormalized, setTemplateNormalized] = useState<Template | null>(
    null
  );

  const { mutate } = useAPIMutationAuth<Template, null>("/gym/templates", {
    onSuccess: () => {
      setTemplate(null);
      setModalOpen(false);
      setModalOpenName(false);
      setModalOpenExercise(false);
      q.invalidateQueries({
        queryKey: ["templates"],
      });
    },
  });

  const generateTemplate = () => {
    setTemplate({
      workout: {
        name,
      },
      workout_exercises: [],
      sets: [],
    });
  };

  const sendTemplate = () => {
    if (templateNormalized) {
      mutate(templateNormalized);
    }
  };

  useEffect(() => {
    if (template) {
      let newNormalized: Template = {
        ...template,
        sets: [],
        workout_exercises: [],
      };
      const setsTemp = template.sets ? [...template.sets] : [];
      // order sets based on template_exercise_id
      const set_temp: { [key: string]: number } = {};
      template.sets?.forEach((set, i) => {
        if (!set_temp[set.template_exercise_id]) {
          set_temp[set.template_exercise_id] = 1;
        } else {
          set_temp[set.template_exercise_id] =
            set_temp[set.template_exercise_id] + 1;
        }

        setsTemp[i] = {
          ...set,
          order_no: set_temp[set.template_exercise_id],
        };
      });

      newNormalized = {
        ...newNormalized,
        sets: setsTemp,
      };

      // filter workout exercise without done sets
      const weTemp = template.workout_exercises
        ? [...template.workout_exercises]
        : [];
      weTemp?.forEach((set, i) => {
        weTemp[i] = {
          ...set,
          order_no: i + 1,
        };
      });

      newNormalized = {
        ...newNormalized,
        workout_exercises: weTemp,
      };

      setTemplateNormalized(newNormalized);
    } else {
      setTemplateNormalized(null);
    }
  }, [template]);

  return (
    <>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => (template ? setModalOpen(true) : setModalOpenName(true))}
      >
        <PlusCircledIcon className="mr-2 h-5 w-5" /> Add Template
      </Button>
      <Dialog
        open={modalOpenName}
        onOpenChange={(open) => setModalOpenName(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter template name</DialogTitle>
          </DialogHeader>
          <Input
            ref={ref}
            placeholder="Morning Workout"
            className="text-lg h-12 my-4 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />
          <DialogFooter className="gap-3">
            <Button onClick={() => setModalOpenName(false)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                generateTemplate();
                setModalOpenName(false);
                setModalOpen(true);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalOpen && template !== null}
        onOpenChange={(open) => setModalOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New template: {template?.workout?.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto py-4" style={{ maxHeight: "70svh" }}>
            <div className="grid gap-4">
              {template?.workout_exercises?.map((workout_exercise) => (
                <div key={workout_exercise.id}>
                  <ExerciseListCard
                    exercise={workout_exercise}
                    setTemplate={setTemplate}
                    template={template}
                  />
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setModalOpenExercise(true);
                setModalOpen(false);
              }}
            >
              <PlusCircledIcon className="mr-2 h-5 w-5" /> Add Exercise
            </Button>
          </div>

          <DialogFooter className="gap-3 md:flex grid grid-cols-4">
            <Button
              onClick={() => {
                setModalOpenName(true);
                setModalOpen(false);
              }}
              variant="ghost"
            >
              Back
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="ghost">
              Close
            </Button>
            <Button
              onClick={sendTemplate}
              className="col-span-2"
              disabled={!template?.workout_exercises?.length}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExerciseModal
        modalOpen={modalOpenExercise}
        setModalOpen={(open) => {
          setModalOpenExercise(open);
          setModalOpen(!open);
        }}
        template={template}
        setTemplate={setTemplate}
      />
    </>
  );
}

export default NewTemplate;
