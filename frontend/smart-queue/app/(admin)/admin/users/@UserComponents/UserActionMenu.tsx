import React, { use, useState } from "react";
import { User } from "@/types/user.types";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Ban, Unlock, Trash2 } from "lucide-react";

interface UserActionsMenuProps {
  user: User;
  onActionComplete: () => void;
}

const UserActionMenu = ({ user, onActionComplete }: UserActionsMenuProps) => {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isBlocked = user.active === false;
  const isAdmin = user.role === "ADMIN";
  const handleBlock = async () => {
    setLoading(true);
    try {
      if (isBlocked) {
        await userService.unblockUser(user.id);
        toast.success("User unblocked successfully");
      } else {
        await userService.blockUser(user.id);
        toast.success("User blocked successfully");
      }
      onActionComplete();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
      setShowBlockDialog(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await userService.deleteUser(user.id);
      toast.success("User deleted successfully");
      onActionComplete();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setShowBlockDialog(true)}
            className="cursor-pointer"
          >
            {isBlocked ? (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Unblock User
              </>
            ) : (
              <>
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </>
            )}
          </DropdownMenuItem>
           <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Block/Unblock Confirmation */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBlocked ? "Unblock User" : "Block User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBlocked
                ? `Are you sure you want to unblock ${user.name}? They will be able to login again.`
                : `Are you sure you want to block ${user.name}? They will not be able to login.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock} disabled={loading}>
              {loading ? "Processing..." : isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {user.name}? This
              action cannot be undone. All their data including tickets will be
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionMenu;
