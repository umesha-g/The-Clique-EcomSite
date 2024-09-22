"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SignInForm from "./AuthFormComponents/SignInForm";
import SignUpForm from "./AuthFormComponents/SignUpForm";

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  //const [username, setUsername] = useState("");
  const [errorOf, setError] = useState("");
  const router = useRouter();
  const [staySignedIn, setStaySignedIn] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;
    try {
      if (!isSignUp) {
        response = await axios.post(
          "http://localhost:8080/api/users/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/api/users/register",
          {
            email,
            password,
            fullName,
          },
          { withCredentials: true }
        );
      }
      if (response.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <div className="lg:grid-rows-1 grid-cols-1 grid h-screen 2xl:p-40 xl:p-32 p-24 overflow-hidden relative">
      <div className="rounded-3xl flex w-full overflow-hidden bg-indigo-900">
        <div className="w-1/2 flex items-center pl-20 justify-center bg-gray-800">
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            setStaySignedIn={setStaySignedIn}
            staySignedIn={staySignedIn}
            //isLoading={isLoading}
            isVisible={isSignUp}
            errorOf={errorOf}
          />
        </div>
        <div className="w-1/2 flex items-center pr-20 justify-center bg-gray-800">
          <SignUpForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            // isLoading={isLoading}
            isVisible={!isSignUp}
            errorOf={errorOf}
          />
        </div>
        <motion.div
          className="absolute 2xl:p-40 xl:p-32 p-24 top-0 left-0 w-1/2 h-full flex items-center overflow-hidden justify-center"
          initial={false}
          animate={{ x: isSignUp ? "0%" : "100%" }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        >
          <div className="place-items-center place-content-center flex-col rounded-3xl flex w-full h-full overflow-hidden bg-indigo-600">
            <div className=" max-w-md p-8 z-20 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">
                {isSignUp ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="mb-8 text-purple-200">
                {isSignUp
                  ? "Already have an account? Sign in to continue your journey."
                  : "Don't have an account? Sign up and start your adventure today."}
              </p>
              <button
                onClick={toggleForm}
                className="bg-white text-indigo-800 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition duration-300"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;
