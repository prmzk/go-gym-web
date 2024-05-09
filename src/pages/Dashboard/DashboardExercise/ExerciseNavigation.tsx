import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/utils.hook";
import { Route } from "@/routes/_protected.dashboard.exercise";
import { useCallback, useEffect, useRef, useState } from "react";
import ExerciseNavigationFilterBodyPart from "./ExerciseNavigationFilterBodyPart";
import ExerciseNavigationFilterCat from "./ExerciseNavigationFilterCat";
import ExerciseNavigationFilterOrderBy from "./ExerciseNavigationFilterOrderBy";

const ExerciseNavigation = () => {
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

  useEffect(() => {
    handleSearchParams({ newSearch: debouncedSearchTerm });
  }, [debouncedSearchTerm, handleSearchParams]);

  return (
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
          <ExerciseNavigationFilterCat
            handleSearchParams={handleSearchParams}
          />
        </div>

        <div className="flex items-center">
          <ExerciseNavigationFilterBodyPart
            handleSearchParams={handleSearchParams}
          />
        </div>

        <div className="flex items-center">
          <ExerciseNavigationFilterOrderBy
            handleSearchParams={handleSearchParams}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseNavigation;
