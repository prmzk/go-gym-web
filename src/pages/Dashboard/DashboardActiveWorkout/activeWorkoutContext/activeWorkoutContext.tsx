import { createContext, useCallback, useEffect, useState } from "react";
import { ActiveWorkout, IActiveWorkoutContext } from "./type";
import {
  getActiveWorkoutStorage,
  isSatisfiesActiveWorkoutType,
  removeActiveWorkoutStorage,
} from "./activeWorkoutStorage";
import { useToast } from "@/components/ui/use-toast";

export const ActiveWorkoutContext = createContext<IActiveWorkoutContext | null>(
  null
);

export default function ActiveWorkoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [workout, setWorkout] = useState<ActiveWorkout | null>(() => {
    const data = JSON.parse(getActiveWorkoutStorage() || "{}");
    if (isSatisfiesActiveWorkoutType(data)) {
      return data;
    }
    return null;
  });

  const isThereAnyActiveWorkout = !!workout;

  const deleteActiveWorkout = useCallback(() => {
    removeActiveWorkoutStorage();
  }, []);

  const setActiveWorkout = useCallback((activeWorkout: ActiveWorkout) => {
    localStorage.setItem("activeWorkout", JSON.stringify(activeWorkout));
  }, []);

  useEffect(() => {
    try {
      if (!isSatisfiesActiveWorkoutType(workout)) {
        throw new Error("Invalid active workout");
      }
      setActiveWorkout(workout);
    } catch (error) {
      deleteActiveWorkout();
    }
  }, [workout, setActiveWorkout, toast, deleteActiveWorkout]);

  return (
    <ActiveWorkoutContext.Provider
      value={{
        isThereAnyActiveWorkout,
        deleteActiveWorkout,
        workout,
        setWorkout,
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
}
