import React from "react";

interface SignInProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  toggleForm: () => void;
}

const SignIn: React.FC<SignInProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
  toggleForm,
}) => (
  <div className="w-full max-w-md p-8">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
    <form className="w-full" onSubmit={handleSubmit}>
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
    <div className="mt-6 text-center">
      <button
        onClick={toggleForm}
        className="bg-indigo-200 text-indigo-900 font-bold py-2 px-4 rounded-full hover:bg-indigo-300 transition duration-300"
      >
        Switch to Sign Up
      </button>
    </div>
  </div>
);

export default SignIn;
