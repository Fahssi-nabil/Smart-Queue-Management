import { api } from "@/lib/api";
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateProfileResponse,
  ChangePasswordResponse,
} from "@/types/profile.types";

export const profileService = {
  /**
   * Get current user profile
  */
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/profile");
    return response.data;
  },


    /**
   * Update user profile (name and email)
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>("/profile/update", data);
    
    // ✅ Update localStorage after successful update
    localStorage.setItem("userName", response.data.name);
    localStorage.setItem("userEmail", response.data.email);
    
    return response.data;
  },

   /**
   * Change user password 
   */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    const response = await api.patch<ChangePasswordResponse>(
      "/profile/password",
      data
    );
    return response.data;
  },


  

};
