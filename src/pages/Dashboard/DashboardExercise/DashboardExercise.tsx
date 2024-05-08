import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAPIQuery } from "@/lib/api.hooks";
import { useDebounce } from "@/lib/utils.hook";
import { Route } from "@/routes/_protected.dashboard.exercise";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ExercisesBodyPartData,
  ExercisesCategoryData,
  ExercisesData,
  GroupedExercisesData,
} from "../types";
import ExerciseCard from "./ExerciseCard";

const DashboardExercise = () => {
  const { search, bodyPart, category, orderBy } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);
  const ref = useRef<HTMLDivElement>(null);

  const handleSearchParams = useCallback(
    ({
      newBodyPart,
      newCat,
      newSearch,
      newOrderBy,
    }: {
      newSearch?: string;
      newCat?: string;
      newBodyPart?: string;
      newOrderBy?: string;
    }) => {
      navigate({
        search: {
          search: newSearch !== undefined ? newSearch : search,
          category: newCat !== undefined ? newCat : category,
          bodyPart: newBodyPart !== undefined ? newBodyPart : bodyPart,
          orderBy: newOrderBy !== undefined ? newOrderBy : orderBy,
        },
      });
    },
    [bodyPart, category, navigate, search, orderBy]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0 || e.target.value.length > 2)
      setSearchTerm(e.target.value);
  };

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

  const {
    data: dataCategories,
    isPending: isPendingCategories,
    isSuccess: isSuccessCategories,
  } = useAPIQuery<ExercisesCategoryData>("/gym/exercises/categories", {
    queryKey: ["exercise-categories"],
    staleTime: 1000 * 60 * 3,
  });

  const {
    data: dataBodyParts,
    isPending: isPendingBodyParts,
    isSuccess: isSuccessBodyParts,
  } = useAPIQuery<ExercisesBodyPartData>("/gym/exercises/bodyparts", {
    queryKey: ["exercise-bodyparts"],
    staleTime: 1000 * 60 * 3,
  });

  useEffect(() => {
    handleSearchParams({ newSearch: debouncedSearchTerm });
  }, [debouncedSearchTerm, handleSearchParams]);

  return (
    <>
      <div
        className="sticky z-10 top-0 bg-background py-2 group border-b"
        ref={ref}
      >
        <h1 className="text-xl font-bold mb-6 ">Exercise</h1>
        <div className="flex items-center border rounded-lg py-1">
          <p className="w-8 text-center">🔍</p>
          <Input
            placeholder="Search"
            className="text-lg py-2 border-none p-0 pl-1 ring-0 h-8"
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex items-center">
            <Select
              onValueChange={(newCat) => handleSearchParams({ newCat })}
              value={category}
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              {!isPendingCategories && (
                <SelectContent>
                  <SelectItem value="all" className="capitalize">
                    All Category
                  </SelectItem>
                  {isSuccessCategories &&
                    dataCategories?.categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        className="capitalize"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              )}
            </Select>
          </div>

          <div className="flex items-center">
            <Select
              onValueChange={(newBodyPart) =>
                handleSearchParams({ newBodyPart })
              }
              value={bodyPart}
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Body Part" />
              </SelectTrigger>
              {!isPendingBodyParts && (
                <SelectContent>
                  <SelectItem value="all" className="capitalize">
                    All Body Parts
                  </SelectItem>
                  {isSuccessBodyParts &&
                    dataBodyParts?.body_parts?.map((body_part) => (
                      <SelectItem
                        key={body_part.id}
                        value={body_part.name}
                        className="capitalize"
                      >
                        {body_part.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              )}
            </Select>
          </div>

          <div className="flex items-center">
            <Select
              onValueChange={(newOrderBy) => handleSearchParams({ newOrderBy })}
              value={orderBy}
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="bodyPart">Body Part</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
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
