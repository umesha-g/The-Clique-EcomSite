"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
    try {
      if (!isSignUp) {
        // Handle Login
        const response = await axios.post(
          "http://localhost:8080/api/users/login",
          {
            email,
            password,
            staySignedIn,
          }
        );

        localStorage.setItem("token", response.data.token);
        if (staySignedIn) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      } else {
        // Handle Register
        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          {
            email,
            password,
            fullName,
          }
        );
        localStorage.setItem("token", response.data.token);
      }
      router.push("/"); // Redirect to home page
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

interface FormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  //isLoading: boolean;
  staySignedIn: boolean;
  setStaySignedIn: (value: boolean) => void;
  isVisible: boolean;
  errorOf: string;
}

interface SignUpFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  //isLoading: boolean;
  isVisible: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  errorOf: string;
}

const SignInForm: React.FC<FormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  staySignedIn,
  setStaySignedIn,
  //isLoading,
  isVisible,
  errorOf,
}) => (
  <motion.form
    className="w-full max-w-md p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 0 : 1 }}
    transition={{ duration: 0.1 }}
    onSubmit={handleSubmit}
  >
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
    <div className="mb-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 bg-gray-700 border rounded text-white border-gray-300 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
        required
      />
    </div>
    <div className="mb-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 bg-gray-700 border rounded text-white border-gray-300 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
        required
      />
    </div>
    <div className="flex items-center my-4 justify-between">
      <div className="flex items-center">
        <input
          id="stay-signed-in"
          name="stay-signed-in"
          type="checkbox"
          className="h-5 w-5 bg-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
          checked={staySignedIn}
          onChange={(e) => setStaySignedIn(e.target.checked)}
        />
        <label
          htmlFor="stay-signed-in"
          className="ml-2 block text-sm text-gray-300"
        >
          Stay signed in
        </label>{" "}
      </div>
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-800 transition duration-300"
      //disabled={isLoading}
    >
      {/*{isLoading ? "Loading..." : "Sign In"}*/}
      Sign In
    </button>
    {errorOf && (
      <div className="mt-4 text-center">
        <p className="text-red-500">{errorOf}</p>
      </div>
    )}
  </motion.form>
);

const SignUpForm: React.FC<SignUpFormProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  //isLoading,
  isVisible,
  errorOf,
}) => (
  <motion.form
    className="w-full max-w-md p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 0 : 1 }}
    transition={{ duration: 0.1 }}
    onSubmit={handleSubmit}
  >
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
    <div className="mb-4">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete=""
        placeholder="Full Name"
        className="w-full px-3 py-2 bg-gray-700 border rounded text-white border-gray-300 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
        required
      />
    </div>
    <div className="mb-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 border bg-gray-700 rounded text-white border-gray-300 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
        required
      />
    </div>
    <div className="mb-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 bg-gray-700 border rounded text-white border-gray-300 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-800 transition duration-300"
      // disabled={isLoading}
    >
      {/*isLoading ? "Loading..." : "Sign Up"*/}
      Sign Up
    </button>
    {errorOf && (
      <div className="mt-4 text-center">
        <p className="text-red-500">{errorOf}</p>
      </div>
    )}
  </motion.form>
);

export default AuthForm;
