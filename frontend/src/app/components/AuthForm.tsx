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
    <div className="flex h-screen p-20 bg-transparent overflow-hidden">
      <div className="rounded-3xl flex w-full overflow-hidden bg-indigo-900">
        <motion.div
          className="w-1/2 flex items-center  justify-center bg-indigo-900"
          initial={{ x: "100%", opacity: 1 }}
          animate={{ x: isSignIn ? "0%" : "100%", opacity: [1, 0, 1] }}
          transition={{
            type: "spring",
            ease: "easeInOut",
            duration: 1,
            opacity: { duration: 0.1 },
          }}
        >
          <div className="w-full max-w-md p-8">
            {isSignIn ? (
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            ) : (
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
                <p className="mb-8 text-indigo-200">
                  Already have an account? Sign in to continue your journey.
                </p>
                <button
                  onClick={toggleForm}
                  className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-full hover:bg-indigo-100 transition duration-300"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          className="w-1/2 flex items-center justify-center bg-purple-900"
          initial={{ x: "-100%", opacity: 1 }}
          animate={{ x: isSignIn ? "0%" : "-100%", opacity: [1, 0, 1] }}
          transition={{
            type: "spring",
            ease: "easeInOut",
            duration: 1,
            opacity: { duration: 0.1 },
          }}
        >
          <div className="w-full max-w-md p-8">
            {isSignIn ? (
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-6">Join Us</h2>
                <p className="mb-8 text-purple-200">
                  Don t have an account? Sign up and start your adventure today.
                </p>
                <button
                  onClick={toggleForm}
                  className="bg-white text-purple-900 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <SignUpForm
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
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
}) => (
  <form className="w-full" onSubmit={handleSubmit}>
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
    <div className="mb-6">
      <input
        className="w-full bg-indigo-800 text-white border-2 border-indigo-700 rounded-lg py-3 px-4 placeholder-indigo-400 focus:outline-none focus:border-indigo-500 transition duration-300"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-indigo-800 text-white border-2 border-indigo-700 rounded-lg py-3 px-4 placeholder-indigo-400 focus:outline-none focus:border-indigo-500 transition duration-300"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
    </div>
    <div className="flex items-center justify-center">
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Sign In"}
      </button>
    </div>
  </form>
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
}) => (
  <form className="w-full" onSubmit={handleSubmit}>
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <div className="flex items-center justify-center">
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </button>
    </div>
  </form>
);

export default AuthForm;
