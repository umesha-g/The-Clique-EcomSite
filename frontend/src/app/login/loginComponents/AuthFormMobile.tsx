"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MobileAuthForm: React.FC = () => {
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
          "http://localhost:8080/api/register",
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
    <div className="min-h-screen  p-4 flex flex-col justify-center">
      <div className="bg-gray-800 relative rounded-lg shadow-md w-full max-w-sm h-[450px] mx-auto">
        <h2 className="text-2xl font-bold text-center w-full h-20 rounded-lg content-center bg-indigo-600 mb-8">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 bg-gray-700 text-white rounded-md outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                required
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-700 text-white rounded-md outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-700 text-white rounded-md outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              required
            />
            <div className="absolute bottom-3 ml-14 text-center">
              <button
                onClick={toggleForm}
                className="text-white hover:underline"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
            {!isSignUp && (
              <div className="flex items-center my-4 justify-between">
                <div className="flex items-center">
                  <input
                    id="stay-signed-in"
                    name="stay-signed-in"
                    type="checkbox"
                    className="h-5 w-5 bg-indigo-800 focus:ring-indigo-800 border-gray-300 rounded"
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
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-800 transition duration-300"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>

            {errorOf && (
              <div className="mt-4 text-center">
                <p className="text-red-500">{errorOf}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileAuthForm;
