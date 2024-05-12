import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearch } from "@tanstack/react-router";
import { HandleSearchParams } from "./type";

type Props = {
  handleSearchParams: HandleSearchParams;
};

const ExerciseNavigationFilterOrderBy = ({ handleSearchParams }: Props) => {
  const { orderBy } = useSearch({
    from: "/_protected/dashboard/exercise",
  });
  return (
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
  );
};

export default ExerciseNavigationFilterOrderBy;
