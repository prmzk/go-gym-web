import { Exercise } from "../types";
import { Card } from "@/components/ui/card";

type Props = {
  exercise: Exercise;
};

const ExerciseCard = ({ exercise }: Props) => {
  return (
    <Card className="py-4 px-2 rounded-none border-t-0 border-l-0 border-r-0 grid gap-2 cursor-pointer hover:brightness-50">
      <p className="text-lg font-bold">{exercise.name}</p>
      <div className="*:capitalize flex gap-2 items-center">
        <p className="text-slate-300">{exercise.body_part}</p>
        <p className="text-slate-300 text-[4px]">⚪</p>
        <p className="text-slate-300">{exercise.category}</p>
      </div>
    </Card>
  );
};

export default ExerciseCard;
