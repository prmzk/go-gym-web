import { Card } from "@/components/ui/card";
import { DotIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import { FinishedWorkout } from "../types";
import WorkoutCardModal from "./WorkoutCardModal";

type Props = {
  workout: FinishedWorkout;
};

const duration = (start_time: string, end_time: string): string => {
  const start = new Date(start_time);
  const end = new Date(end_time);
  const duration = (end.getTime() - start.getTime()) / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  return `${hours ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function WorkoutCard({ workout }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        key={workout.id}
        className="p-4 flex flex-col gap-3 cursor-pointer hover:bg-gray-900"
        onClick={() => setModalOpen(true)}
      >
        <h1 className="text-xl font-bold">{workout.name}</h1>
        <div className="flex items-center gap-2">
          <p className="text-nd font-semibold text-gray-500">
            {/* format like Sunday, 12 September 2023 at 17:00 */}
            {format(workout.start_time, "EEEE, d MMMM yyyy 'at' HH:mm")}
          </p>
          <DotIcon />
          <p className="text-nd font-semibold text-gray-500">
            {duration(workout.start_time, workout.end_time)}
          </p>
        </div>
      </Card>
      <WorkoutCardModal
        workout={workout}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}

export default WorkoutCard;
