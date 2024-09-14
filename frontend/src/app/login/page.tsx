"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "../components/AuthForm"; // Make sure the path is correct
import MobileAuthForm from "../components/AuthFormMobile";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    email: string,
    password: string,
    fullName: string,
    isSignUp: boolean
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
          isSignUp ? "Failed to create account" : "Invalid email or password"
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="lg:block hidden">
        <AuthForm onSubmit={handleSubmit} isLoading={false} />
      </div>

      <div className="lg:hidden block">
        <MobileAuthForm onSubmit={handleSubmit} isLoading={false} />
      </div>
      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
