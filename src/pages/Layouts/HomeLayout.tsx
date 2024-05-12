import { Outlet } from "@tanstack/react-router";

function HomeLayout() {
  return (
    <div className="h-svh">
      <div className="w-full py-32 container h-full flex flex-col space-y-14 justify-center">
        <h1 className="text-center text-7xl text-teal-500 font-title">
          Nge Gym App
        </h1>
        <div className="flex justify-center">
          <img src="/NGA.webp" alt="NGA" width={300} height={300} />
        </div>
        <div className="flex flex-col gap-4 max-w-96 mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
