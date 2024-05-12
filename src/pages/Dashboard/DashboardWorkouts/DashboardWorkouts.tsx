import { useAPIQueryAuth } from "@/lib/api.hooks";
import { useAuth } from "@/lib/auth";
import { FinishedWorkoutData } from "../types";
import WorkoutCard from "./WorkoutCard";

function DashboardWorkouts() {
  const { token } = useAuth();

  const { data } = useAPIQueryAuth<FinishedWorkoutData>("/gym/workouts/", {
    queryKey: ["workouts", "all", token],
  });

  return (
    <div className="py-12">
      <div className="flex items-center justify-between gap-3 mb-6 ">
        <h1 className="text-2xl font-bold">Workouts</h1>
      </div>
      <div className="grid gap-3">
        {data?.workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}

export default DashboardWorkouts;
