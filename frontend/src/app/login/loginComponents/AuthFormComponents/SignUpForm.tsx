import { motion } from "framer-motion";
import React from "react";

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

export default SignUpForm;
