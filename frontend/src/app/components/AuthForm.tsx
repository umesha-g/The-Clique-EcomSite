import { motion } from "framer-motion";
import React, { useState } from "react";

interface AuthFormProps {
  onSubmit: (email: string, password: string, isSignIn: boolean) => void;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, isSignIn);
  };

  return (
    <div className="lg:grid-rows-1 grid-cols-1 grid h-screen p-20  overflow-hidden relative">
      <div className="rounded-3xl flex w-full overflow-hidden bg-indigo-900">
        <div className="w-1/2 flex items-center justify-center bg-white">
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isVisible={isSignIn}
          />
        </div>
        <div className="w-1/2 flex items-center justify-center bg-white">
          <SignUpForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isVisible={!isSignIn}
          />
        </div>
        <motion.div
          className="absolute p-20 top-0 left-0 w-1/2 h-full flex items-center overflow-hidden justify-center"
          initial={false}
          animate={{ x: isSignIn ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="place-items-center place-content-center flex-col rounded-3xl flex w-full h-full overflow-hidden bg-purple-600">
            <div className=" max-w-md p-8 z-20 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">
                {isSignIn ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="mb-8 text-purple-200">
                {isSignIn
                  ? "Already have an account? Sign in to continue your journey."
                  : "Don't have an account? Sign up and start your adventure today."}
              </p>
              <button
                onClick={toggleForm}
                className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition duration-300"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
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
  isLoading: boolean;
  isVisible: boolean;
}

interface SignUpFormProps extends FormProps {
  fullName: string;
  setFullName: (value: string) => void;
}

const SignInForm: React.FC<FormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
  isVisible,
}) => (
  <motion.form
    className="w-full max-w-md p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 0 : 1 }}
    transition={{ duration: 0.3 }}
    onSubmit={handleSubmit}
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
      Sign In
    </h2>
    <div className="mb-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 border rounded text-gray-700"
        required
      />
    </div>
    <div className="mb-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 border rounded text-gray-700"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition duration-300"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Sign In"}
    </button>
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
  isLoading,
  isVisible,
}) => (
  <motion.form
    className="w-full max-w-md p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: isVisible ? 0 : 1 }}
    transition={{ duration: 0.3 }}
    onSubmit={handleSubmit}
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
      Sign Up
    </h2>
    <div className="mb-4">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="w-full px-3 py-2 border rounded text-gray-700"
        required
      />
    </div>
    <div className="mb-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 border rounded text-gray-700"
        required
      />
    </div>
    <div className="mb-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 border rounded text-gray-700"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition duration-300"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Sign Up"}
    </button>
  </motion.form>
);

export default AuthForm;
