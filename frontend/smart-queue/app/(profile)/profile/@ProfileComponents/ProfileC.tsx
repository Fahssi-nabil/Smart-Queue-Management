"use client";
import { Badge, Mail, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { da } from "zod/locales";
import { profile } from "console";
import { profileService } from "@/services/profileService";
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ProfileC = () => {
  const [user, setUser] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  // Simulate fetching user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
       const data = await profileService.getProfile();
       setUser(data);
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        fetchUserData();
    }, []);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="w-14 h-14" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">No user data found.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 font-medium">{user.role}</span>
              </div>
              <p className="text-gray-500 text-sm">ID: {user.id}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <EditProfile onProfileUpdate={fetchUserData} />
            <ChangePasswordDialog />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Contact Information
        </h2>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <label className="text-sm font-semibold text-gray-900 block">
                Email Address
            </label>
            <p className="text-gray-700 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Account Information
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Full Name</span>
            <span className="font-semibold text-gray-900">{user.name}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Role</span>
            <span className="font-semibold text-gray-900">{user.role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Status</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-semibold text-gray-900">Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileC;
