export type HandleSearchParams = ({
  newBodyPart,
  newCat,
  newSearch,
  newOrderBy,
}: {
  newSearch?: string;
  newCat?: string;
  newBodyPart?: string;
  newOrderBy?: string;
}) => void;
