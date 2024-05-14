import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { useDebounce } from "@/lib/utils.hook";
import { useMemo, useState } from "react";
import { ExercisesData, GroupedExercisesData } from "../types";
import ExerciseCard from "./ExerciseCard";
import { Template } from "./type";

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  template: Template | null;
  setTemplate: (template: Template | null) => void;
};

function ExerciseModal({
  modalOpen,
  setModalOpen,
  setTemplate,
  template,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0 || e.target.value.length > 2)
      setSearchTerm(e.target.value);
  };

  const { data, isFetching } = useAPIQueryAuth<ExercisesData>(
    `/gym/exercises?name=${debouncedSearchTerm}`,
    {
      queryKey: ["exercise", { search: debouncedSearchTerm }],
      staleTime: 1000 * 60 * 3,
      enabled: modalOpen,
    }
  );

  const groupedData = useMemo<GroupedExercisesData | undefined>(() => {
    if (data) {
      const grouped: GroupedExercisesData = { exercises: {} }; // Add the missing 'exercises' property
      data.exercises.forEach((exercise) => {
        const firstLetter = exercise.name.charAt(0).toUpperCase();
        if (grouped.exercises[firstLetter]) {
          grouped.exercises[firstLetter].push(exercise);
        } else {
          grouped.exercises[firstLetter] = [exercise];
        }
      });
      return grouped;
    }

    return undefined;
  }, [data]);

  return (
    <Dialog
      open={!isFetching && modalOpen}
      onOpenChange={(open) => setModalOpen(open)}
    >
      <DialogContent>
        <div className="flex items-center border rounded-lg py-1">
          <p className="w-8 text-center">🔍</p>
          <Input
            placeholder="Search"
            className="text-lg py-2 border-none p-0 pl-1 ring-0 h-8"
            onChange={handleChange}
          />
        </div>
        <ul
          className="grid gap-4 overflow-y-auto"
          style={{ maxHeight: "60svh" }}
        >
          {Object.keys(groupedData?.exercises || {}).map((key) => (
            <li className="grid mb-6" key={key}>
              <p className="border-b pb-4 text-slate-300 font-bold capitalize">
                {key}
              </p>
              {groupedData?.exercises[key].map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  setTemplate={setTemplate}
                  template={template}
                />
              ))}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button onClick={() => setModalOpen(false)} variant="ghost">
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExerciseModal;
