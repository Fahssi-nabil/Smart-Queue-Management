import { api } from "@/lib/api";
import { User } from "@/types/user.types";

export const userService = {
  /**
   * Get all users (Admin only)
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/admin/users");
    return response.data;
  },

  /**
   * ✅ NEW: Block user
   */
  blockUser: async (userId: number): Promise<void> => {
    await api.patch(`/admin/users/${userId}/block`);
  },

  /**
   * ✅ NEW: Unblock user
   */
  unblockUser: async (userId: number): Promise<void> => {
    await api.patch(`/admin/users/${userId}/unblock`);
  },

  /**
   * ✅ NEW: Soft Delete user
   */
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

};
