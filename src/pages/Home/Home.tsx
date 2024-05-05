import { useState } from "react";
import LogInForm from "./LogInForm";
import RegisterForm from "./Register/Register";

const Home = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const setToRegister = () => setMode("register");
  const setToLogin = () => setMode("login");

  return (
    <div className="h-svh">
      <div className="w-full py-32 container h-full flex flex-col space-y-14 justify-center">
        <h1 className="text-center text-7xl text-teal-500 font-title">
          Nge Gym App
        </h1>

        {mode === "login" && (
          <div className="flex justify-center">
            <img src="/NGA.webp" alt="NGA" width={300} height={300} />
          </div>
        )}
        <div className="flex flex-col gap-4 max-w-96 mx-auto w-full">
          {mode === "login" && <LogInForm setToRegister={setToRegister} />}
          {mode === "register" && <RegisterForm setToLogin={setToLogin} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
