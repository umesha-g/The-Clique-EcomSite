import { useState } from "react";

interface MobileAuthFormProps {
  onSubmit: (email: string, password: string,fullName:string, isSignIn: boolean) => void;
  isLoading: boolean;
}

const MobileAuthForm: React.FC<MobileAuthFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password,fullName, isSignIn);
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen  p-4 flex flex-col justify-center">
      <div className="bg-white relative rounded-lg shadow-md p-6 w-full max-w-sm h-96 mx-auto">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-8">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="absolute bottom-0 mb-6 ml-14 text-center">
          <button
            onClick={toggleForm}
            className="text-purple-600 hover:underline"
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAuthForm;
