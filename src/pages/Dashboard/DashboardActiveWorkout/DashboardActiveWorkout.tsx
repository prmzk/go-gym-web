import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useActiveWorkout } from "./activeWorkoutContext";
import FinishWorkout from "./FinishWorkout";
import Timer from "./Timer";
import Title from "./Title";
import WorkoutList from "./WorkoutList";
import RestTimer from "./RestTimer";

function DashboardActiveWorkout() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    deleteActiveWorkout: deleteActiveWorkoutMethod,
    workout,
    setWorkout,
  } = useActiveWorkout();

  const deleteActiveWorkout = () => {
    setWorkout(null);
    deleteActiveWorkoutMethod();
  };

  const closeCongrats = () => {
    setCongratsOpen(false);
    deleteActiveWorkout();
    setWorkout(null);
    navigate({ to: "/dashboard" });
  };

  useEffect(() => {
    if (!workout) {
      navigate({ to: "/dashboard" });
    }
  }, [workout, navigate]);

  return (
    <>
      <div className="py-12">
        <div className="w-full sticky z-10 top-0 bg-background py-4">
          <div className="flex gap-5">
            <div className="w-full">
              <Title />
            </div>
            <div className="shrink-0">
              <Timer />
            </div>
            <Button onClick={() => setCancelOpen(true)} variant="destructive">
              Cancel
            </Button>
          </div>
          <div className="w-full mt-4 grid gap-2">
            <RestTimer />
          </div>
        </div>
        <div className="py-8">
          <WorkoutList />
        </div>
        <div className="grid gap-6 mt-8">
          <Button asChild className="w-full" variant="outline">
            <Link
              to="/dashboard/exercise"
              search={{
                bodyPart: "all",
                category: "all",
                orderBy: "name",
                search: "",
              }}
            >
              <PlusCircledIcon className="mr-2 h-5 w-5" /> Add Exercise
            </Link>
          </Button>
          <Button
            className="w-full"
            onClick={() => setFinishOpen(true)}
            disabled={
              !workout?.workout_exercises?.length || !workout?.sets?.length
            }
          >
            <CheckCircledIcon className="mr-2 h-5 w-5" color="black" /> Finish
            Workout
          </Button>
        </div>
      </div>

      {/* DIALOG CANCEL */}
      <Dialog open={cancelOpen} onOpenChange={(open) => setCancelOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mx-auto mt-4 gap-3">
            <Button onClick={() => setCancelOpen(false)}>Cancel</Button>
            <Button onClick={deleteActiveWorkout} variant="destructive">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG CANCEL */}
      <Dialog
        open={congratsOpen}
        onOpenChange={(open) => {
          if (!open) closeCongrats();
          else setCancelOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>💪💪💪 NICE 💪💪💪</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <p>Good job on finishing your workout!</p>
            <p>Keep up the good work! 🚀</p>
          </div>
          <DialogFooter className="mx-auto mt-4 gap-3">
            <Button onClick={closeCongrats}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG FINISH */}
      <FinishWorkout
        finishOpen={finishOpen}
        setFinishOpen={setFinishOpen}
        setCongratsOpen={setCongratsOpen}
      />
    </>
  );
}

export default DashboardActiveWorkout;
