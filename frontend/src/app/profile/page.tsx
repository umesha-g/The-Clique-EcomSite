"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:9090/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Failed to fetch profile");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchProfile();
  }, [router]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return (
      <div className=" flex justify-items-center place-items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">User Profile</h1>
        <div className="space-y-2">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Full Name:</strong> {profile.fullName}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
