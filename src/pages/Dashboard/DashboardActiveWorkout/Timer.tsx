import { parseDuration } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";
import { useActiveWorkout } from "./activeWorkoutContext";
import { ClockIcon } from "@radix-ui/react-icons";

const Timer = () => {
  const { workout } = useActiveWorkout();
  const [timeElapsed, setTimeElapsed] = useState<string>(
    parseDuration(
      formatDistanceToNowStrict(
        new Date(workout?.workout?.start_time || new Date()),
        {
          unit: "second",
        }
      )
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(() =>
        parseDuration(
          formatDistanceToNowStrict(
            new Date(workout?.workout?.start_time || new Date()),
            {
              unit: "second",
            }
          )
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [workout]);

  return (
    <p className="text-lg font-bold text-slate-300">
      <ClockIcon className="inline w-5 h-5" /> {timeElapsed}
    </p>
  );
};

export default Timer;
