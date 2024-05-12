export type CategoryTitle = {
  weight: string;
  assisted: string;
  reps: string;
  duration: string;
  distance: string;
};

export const categoryProps = {
  weight: "weight" as const,
  assisted: "deducted_weight" as const,
  reps: "reps" as const,
  duration: "duration" as const,
  distance: "weight" as const,
};

export const categorySecondaryProps = {
  weight: "reps" as const,
  assisted: "reps" as const,
  reps: "" as const,
  duration: "" as const,
  distance: "" as const,
};

export const categoryTitle = {
  weight: "Kg",
  assisted: "-Kg",
  reps: "Reps",
  duration: "Duration",
  distance: "Km",
};

export const categorySecondaryTitle = {
  weight: "Reps",
  assisted: "Reps",
  reps: "",
  duration: "",
  distance: "",
};

export const generateWeightProps = ({
  weight = 0,
  reps = 0,
}: {
  weight?: number;
  reps?: number;
}) => ({
  weight,
  reps,
  deducted_weight: null,
  duration: null,
});

export const generateAssistedProps = ({
  deducted_weight = 0,
  reps = 0,
}: {
  deducted_weight?: number;
  reps?: number;
}) => ({
  weight: null,
  reps,
  deducted_weight,
  duration: null,
});

export const generateRepsProps = ({ reps = 0 }: { reps?: number }) => ({
  weight: null,
  reps,
  deducted_weight: null,
  duration: null,
});

export const generateDurationProps = ({
  duration = 0,
}: {
  duration?: number;
}) => ({
  weight: null,
  reps: null,
  deducted_weight: null,
  duration,
});

export const generateDistanceProps = ({
  distance = 0,
}: {
  distance?: number;
}) => ({
  weight: distance,
  reps: null,
  deducted_weight: null,
  duration: null,
});

export const categoryAddSet = {
  weight: generateWeightProps,
  assisted: generateAssistedProps,
  reps: generateRepsProps,
  duration: generateDurationProps,
  distance: generateDistanceProps,
};
