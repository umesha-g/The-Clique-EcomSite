"use client";

import { useState } from "react";
import AuthForm from "./loginComponents/AuthForm";
import MobileAuthForm from "./loginComponents/AuthFormMobile";

export default function LoginPage() {
  const [error] = useState("");

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="lg:block hidden">
        <AuthForm />
      </div>
      <div className="lg:hidden block">
        <MobileAuthForm />
      </div>
      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
