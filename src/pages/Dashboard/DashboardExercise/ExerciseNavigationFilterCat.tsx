import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { useSearch } from "@tanstack/react-router";
import { ExercisesCategoryData } from "../types";
import { HandleSearchParams } from "./type";

type Props = {
  handleSearchParams: HandleSearchParams;
};

const ExerciseNavigationFilterCat = ({ handleSearchParams }: Props) => {
  const { category } = useSearch({
    from: "/_protected/dashboard/exercise",
  });

  const {
    data: dataCategories,
    isPending: isPendingCategories,
    isSuccess: isSuccessCategories,
  } = useAPIQueryAuth<ExercisesCategoryData>("/gym/exercises/categories", {
    queryKey: ["exercise-categories"],
    staleTime: 1000 * 60 * 3,
  });

  return (
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
  );
};

export default ExerciseNavigationFilterCat;
