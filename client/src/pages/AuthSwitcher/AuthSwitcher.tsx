import clsx from "clsx";
import Lottie from "lottie-react";

import loginAnimation from "../../assets/login.json";
import signupAnimation from "../../assets/signup.json";
import SignInForm from "./SignInForm";
import logo from "../../../src/assets/images/finalLogo.webp";

const AuthSwitcher = () => {
  const isSignIn = true;
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#e0f7fa] via-[#ffffff] to-[#e1f5fe] flex items-center justify-center px-4">
      <div
        className={clsx(
          "w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl backdrop-blur-md bg-white/60 border border-white/30 overflow-hidden flex transition-all duration-500",
          isSignIn ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div className="w-1/2 hidden md:flex items-center justify-center p-10 bg-gradient-to-b from-[#e3f2fd] to-[#ffffff]">
          <Lottie
            animationData={isSignIn ? signupAnimation : loginAnimation}
            loop
            className="w-full h-full max-w-[400px]"
          />
        </div>

        {/* Form Side */}
        <div className="hidden md:block w-[1px] bg-gray-300/30 h-full" />
        <div className="w-full md:w-1/2 pl-10 pr-10 bg-white bg-opacity-80">
          <div className="w-full flex justify-center items-center ">
            <img src={logo} alt="Logo" className="h-[25vh]" />
          </div>
          <SignInForm />
          {/* <SignUpForm onSwitch={() => setIsSignIn(true)} /> */}
        </div>
      </div>
    </div>
  );
};

export default AuthSwitcher;
