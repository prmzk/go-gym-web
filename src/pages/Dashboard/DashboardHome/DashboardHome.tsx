import { Button } from "@/components/ui/button";
import { formatRFC3339 } from "date-fns";

const DashboardHome = () => {
  return (
    <>
      <div>
        <div className="sticky z-10 top-0 bg-background py-2 group border-b">
          <h1 className="text-3xl font-bold mb-2">Start a Workout</h1>
          <h2 className="text-md font-semibold mb-6">Lets Go! 🥊🚀</h2>
        </div>
        <div className="py-6">
          <h2 className="text-md font-semibold mb-4">Quick Start</h2>
          <div className="flex w-full">
            <Button
              size="lg"
              className="rounded-xl w-full md:max-w-md"
              onClick={() => {
                console.log(formatRFC3339(new Date()));
              }}
            >
              Start a fresh workout 🏹
            </Button>
          </div>
        </div>
        <div className="py-12 relative h-96"> </div>
        <div className="py-12 relative h-96"> </div>
        <div className="py-12 relative h-96"> </div>
        <div className="py-12 relative h-96"> </div>
        <div className="py-12 relative h-96"> </div>
        <div className="py-12 relative h-96"> </div>
      </div>
    </>
  );
};

export default DashboardHome;
