export type Exercise = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  category: string;
  body_part: string;

  rest_time?: number;
  notes?: string;
};

export type ExercisesData = {
  exercises: Exercise[];
};

export type GroupedExercisesData = {
  exercises: {
    [key: string]: Exercise[];
  };
};

export type ExerciseCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ExercisesCategoryData = {
  categories: ExerciseCategory[];
};

export type ExerciseBodyPart = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ExercisesBodyPartData = {
  body_parts: ExerciseBodyPart[];
};
