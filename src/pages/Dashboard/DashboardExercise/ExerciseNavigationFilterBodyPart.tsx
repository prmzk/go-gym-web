import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import { useSearch } from "@tanstack/react-router";
import { ExercisesBodyPartData } from "../types";
import { HandleSearchParams } from "./type";

type Props = {
  handleSearchParams: HandleSearchParams;
};

const ExerciseNavigationFilterBodyPart = ({ handleSearchParams }: Props) => {
  const { bodyPart } = useSearch({
    from: "/_protected/dashboard/exercise",
  });

  const {
    data: dataBodyParts,
    isPending: isPendingBodyParts,
    isSuccess: isSuccessBodyParts,
  } = useAPIQueryAuth<ExercisesBodyPartData>("/gym/exercises/bodyparts", {
    queryKey: ["exercise-bodyparts"],
    staleTime: 1000 * 60 * 3,
  });

  return (
    <Select
      onValueChange={(newBodyPart) => handleSearchParams({ newBodyPart })}
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
  );
};

export default ExerciseNavigationFilterBodyPart;
