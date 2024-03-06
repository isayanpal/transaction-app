import React from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ButtonWarning from "../components/ButtonWarning";

const Signin = () => {
  return (
    <>
      <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign In"} />
            <SubHeading
              label={"Enter your credentials to access your account"}
            />
            <InputBox placeholder="example@gmail.com" label={"Email"} />
            <InputBox placeholder="*****" label={"Password"} />
            <div className="pt-4">
              <Button label={"Sign in"} />
            </div>
            <ButtonWarning
              label={"Don't have an account?"}
              buttonText={"Sign up"}
              to={"/signup"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
