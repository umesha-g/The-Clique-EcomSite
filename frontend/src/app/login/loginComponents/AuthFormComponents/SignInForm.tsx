import { motion } from "framer-motion";
import React from "react";

interface SignInFormProps {
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

const SignInForm: React.FC<SignInFormProps> = ({
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

export default SignInForm;
