import { Progress } from "@/components/ui/progress";
import { useActiveWorkout } from "./activeWorkoutContext";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClockIcon, TrashIcon } from "@radix-ui/react-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { parseDurationToNumber } from "@/lib/utils";

const parseTimer = (time: string | undefined): number =>
  time
    ? parseDurationToNumber(
        formatDistanceToNowStrict(new Date(time), {
          unit: "second",
        })
      )
    : 0;

function RestTimer() {
  const { setWorkout, workout } = useActiveWorkout();
  const [timeElapsed, setTimeElapsed] = useState<number>(
    parseTimer(workout?.lastSet?.rest_done)
  );

  const handleDeleteTimer = useCallback(() => {
    setWorkout({
      ...workout,
      lastSet: undefined,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        workout?.lastSet?.rest_done &&
        new Date(workout?.lastSet?.rest_done) < new Date(Date.now())
      ) {
        clearInterval(interval);
        return;
      }
      setTimeElapsed(() => parseTimer(workout?.lastSet?.rest_done));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout]);

  useEffect(() => {
    setTimeElapsed(() => parseTimer(workout?.lastSet?.rest_done));
  }, [workout]);

  return (
    <>
      <p>Rest timer:</p>
      <div className="flex items-center gap-2 h-6">
        {!workout?.lastSet ||
        new Date(workout?.lastSet.rest_done) < new Date(Date.now()) ? (
          <>
            <ClockIcon />
            <Progress value={0} className="*:bg-teal-400" />
          </>
        ) : (
          <>
            <p>{timeElapsed}</p>
            <Progress
              value={(timeElapsed / workout?.lastSet.rest_time) * 100}
              className="*:bg-teal-400"
            />
            <Button size="icon" variant="ghost" onClick={handleDeleteTimer}>
              <TrashIcon />
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default RestTimer;
