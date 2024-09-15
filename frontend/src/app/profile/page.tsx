"use client";

import axios from "axios";
import { IdCard, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgHome } from "react-icons/cg";

interface UserProfile {
  email: string;
  fullName: string;
}

const ProfilePage: React.FC = () => {
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
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // axios handles errors for non-2xx status codes
          setProfile(response.data);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchProfile();
  }, [router]);

  const goToHome = () => {
    router.push("/");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-lg shadow-xl">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-lg shadow-xl">
          <p className="text-blue-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-white">
          Profile
        </h1>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-gray-300">
            <Mail className="w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <IdCard className="w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{profile.fullName}</p>
            </div>
          </div>
        </div>
        <button
          onClick={goToHome}
          className="flex items-center justify-center w-full mt-8 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 transition duration-300"
        >
          <CgHome className="w-5 h-5 mr-2" />
          Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
