import { Input } from "@/components/ui/input";
import { useOutsideClick } from "@/lib/utils.hook";
import { useEffect, useRef, useState } from "react";
import { useActiveWorkout } from "./activeWorkoutContext";

const Title = () => {
  const { workout, setWorkout } = useActiveWorkout();
  const [name, setName] = useState(workout?.workout?.name || "");
  const [nameEdit, setNameEdit] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const handleEditName = () => {
    setNameEdit(false);
    if (workout?.workout) {
      setWorkout({
        ...workout,
        workout: {
          ...workout?.workout,
          name,
          start_time: workout?.workout?.start_time,
        },
      });
    }
  };
  const outsideRef = useOutsideClick(handleEditName);

  useEffect(() => {
    if (nameEdit) ref.current?.focus();
  }, [nameEdit, ref]);

  return !nameEdit ? (
    <h1
      className="font-bold text-2xl cursor-pointer"
      onClick={() => {
        setNameEdit(true);
      }}
    >
      {workout?.workout?.name}
    </h1>
  ) : (
    <div ref={outsideRef}>
      <form onSubmit={handleEditName}>
        <Input
          placeholder="Morning Workout"
          className=" text-2xl"
          onChange={(e) => setName(e.target.value)}
          value={name}
          ref={ref}
        />
      </form>
    </div>
  );
};

export default Title;
