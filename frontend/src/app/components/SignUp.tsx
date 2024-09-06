import React from "react";

interface SignUpProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  toggleForm: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
  toggleForm,
}) => (
  <div className="w-full max-w-md p-8">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
    <form className="w-full" onSubmit={handleSubmit}>
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
    <div className="mt-6 text-center">
      <button
        onClick={toggleForm}
        className="bg-purple-200 text-purple-900 font-bold py-2 px-4 rounded-full hover:bg-purple-300 transition duration-300"
      >
        Switch to Sign In
      </button>
    </div>
  </div>
);

export default SignUp;
