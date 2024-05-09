import { useAPIQuery } from "@/lib/api.hooks";
import { Route } from "@/routes/_protected.dashboard.exercise";
import { useMemo } from "react";
import { ExercisesData, GroupedExercisesData } from "../types";
import ExerciseCard from "./ExerciseCard";
import ExerciseNavigation from "./ExerciseNavigation";

const DashboardExercise = () => {
  const { search, bodyPart, category, orderBy } = Route.useSearch();

  const { data, isPending, isSuccess } = useAPIQuery<ExercisesData>(
    `/gym/exercises?name=${search}&category=${category}&body_part=${bodyPart}`,
    {
      queryKey: ["exercise", { search, category, bodyPart }],
      staleTime: 1000 * 60 * 3,
    }
  );

  const groupedData = useMemo<GroupedExercisesData | undefined>(() => {
    if (data && (!orderBy || orderBy === "name")) {
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
    } else if (data && orderBy === "category") {
      const grouped: GroupedExercisesData = { exercises: {} };
      data.exercises.forEach((exercise) => {
        if (grouped.exercises[exercise.category]) {
          grouped.exercises[exercise.category].push(exercise);
        } else {
          grouped.exercises[exercise.category] = [exercise];
        }
      });
      return grouped;
    } else if (data && orderBy === "bodyPart") {
      const grouped: GroupedExercisesData = { exercises: {} };
      data.exercises.forEach((exercise) => {
        if (grouped.exercises[exercise.body_part]) {
          grouped.exercises[exercise.body_part].push(exercise);
        } else {
          grouped.exercises[exercise.body_part] = [exercise];
        }
      });
      return grouped;
    }

    return undefined;
  }, [data, orderBy]);

  return (
    <>
      <ExerciseNavigation />
      <div className="py-12 relative">
        {isPending && <div>Loading...</div>}
        {isSuccess && (
          <ul className="grid gap-4">
            {Object.keys(groupedData?.exercises || {}).map((key) => (
              <li className="grid mb-6">
                <p className="border-b pb-4 text-slate-300 font-bold capitalize">
                  {key}
                </p>
                {groupedData?.exercises[key].map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default DashboardExercise;
