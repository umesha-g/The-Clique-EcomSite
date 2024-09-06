"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "../components/AuthForm"; // Make sure the path is correct

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    email: string,
    password: string,
    isSignIn: boolean
  ) => {
    setError("");

    try {
      const response = await fetch("http://localhost:9090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/profile");
      } else {
        setError(
          isSignIn ? "Invalid email or password" : "Failed to create account"
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950">
      <AuthForm onSubmit={handleSubmit} isLoading={false} />
      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
