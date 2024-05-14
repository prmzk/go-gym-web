import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { formatRFC3339 } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useActiveWorkout } from "../DashboardActiveWorkout/activeWorkoutContext";
import { generateActiveWorkout } from "../DashboardActiveWorkout/activeWorkoutContext/activeWorkoutStorage";
import TemplateList from "./TemplateList";

function DashboardHome() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const { setWorkout, isThereAnyActiveWorkout } = useActiveWorkout();
  const navigate = useNavigate();

  const newActiveWorkout = () => {
    setWorkout(
      generateActiveWorkout({
        created_at: formatRFC3339(new Date()),
        name,
        start_time: formatRFC3339(new Date()),
      })
    );
    navigate({ to: "/dashboard/workouts/active" });
    setModalOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      ref?.current?.blur();
    }, 2);

    return () => {
      clearTimeout(timer);
    };
  }, [modalOpen]);

  return (
    <>
      <div>
        <div className="bg-background py-2 group border-b">
          <h1 className="text-3xl font-bold mb-2">Start a Workout</h1>
          <h2 className="text-md font-semibold mb-3">Lets Go!</h2>
        </div>
        <div className="py-3">
          <h2 className="text-md font-semibold mb-4">Quick Start</h2>
          <div className="flex w-full">
            <Button
              size="lg"
              className="rounded-xl w-full md:max-w-md"
              disabled={isThereAnyActiveWorkout}
              onClick={() => setModalOpen(true)}
            >
              {isThereAnyActiveWorkout
                ? "Workout in progress!"
                : "Start a fresh workout 🏹"}
            </Button>
          </div>
        </div>

        <TemplateList />
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter workout name</DialogTitle>
          </DialogHeader>
          <Input
            ref={ref}
            placeholder="Morning Workout"
            className="text-lg h-12 my-4 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />
          <DialogFooter className="gap-3">
            <Button onClick={() => setModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={newActiveWorkout}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DashboardHome;
