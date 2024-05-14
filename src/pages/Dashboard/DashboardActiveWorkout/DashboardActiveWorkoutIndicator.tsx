import { useActiveWorkout } from "./activeWorkoutContext";
import { Link, useRouterState } from "@tanstack/react-router";
import Timer from "./Timer";

const DashboardActiveWorkoutIndicator = () => {
  const { isThereAnyActiveWorkout } = useActiveWorkout();
  const { location } = useRouterState();

  if (
    !isThereAnyActiveWorkout ||
    location?.pathname === "/dashboard/workouts/active"
  )
    return null;

  return (
    <Link to="/dashboard/workouts/active">
      <div className="container max-w-[960px]">
        <div className="py-2 md:py-4 flex flex-col items-center gap-1">
          <Timer />
          <p className="text-center text-lg font-bold">On Going Workout..</p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardActiveWorkoutIndicator;
