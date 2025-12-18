"use client";

import { useState } from "react";
import { Eye, Edit3, Mail,  Wallet, Landmark, IndianRupee, Users, Trash2, Undo2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { restoreUserById } from "@/lib/adminServices";

export default function UserCard({ user, type }) {
  const router = useRouter();
  const isDeleted = type === "deleted";
  const [loading, setLoading] = useState(false);

  // Restore user
  const handleRestore = async () => {
    if (!user?._id) return alert("User ID missing.");

    if (!confirm(`Restore ${user.username}?`)) return;

    try {
      setLoading(true);
      const res = await restoreUserById(user._id);

      if (res.error) return alert(res.error);

      alert("User restored successfully!");
      router.refresh();
    } catch {
      alert("Failed to restore user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        group relative rounded-2xl p-5 sm:p-6
        border backdrop-blur-md transition-all duration-300
        ${
          isDeleted
            ? "bg-gray-200/50 dark:bg-gray-800/40 border-gray-400 dark:border-gray-700"
            : "bg-gray-100/60 dark:bg-gray-900/40 border-gray-300 dark:border-gray-700"
        }
        hover:border-gray-500 dark:hover:border-gray-500
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              p-2 rounded-full
              ${
                isDeleted
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {isDeleted ? <Trash2 size={18} /> : <Users size={18} />}
          </div>

          <h2 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 truncate max-w-[10rem]">
            {user.username || (isDeleted ? "Deleted User" : "Unknown User")}
          </h2>
        </div>

        <span
          className="
            text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase
            bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300
          "
        >
          {isDeleted ? "Deleted" : user.role || "user"}
        </span>
      </div>

      {/* Info */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-5">
        <p className="flex items-center gap-2 truncate">
          <Mail size={14} className="text-gray-500 dark:text-gray-400" />
          {user.email || "No Email"}
        </p>

        <p className="flex items-center gap-2 truncate">
          <Wallet size={14} className="text-gray-500 dark:text-gray-400" />
          {user?.balance|| 0}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        {/* View Button */}
        <button
          className="
            flex-1 px-3 py-2 rounded-lg border
            flex items-center justify-center gap-1 font-medium
            text-sm sm:text-base transition
            bg-gray-200 dark:bg-gray-700 
            text-gray-800 dark:text-gray-200
            border-gray-400 dark:border-gray-600
            hover:bg-gray-300 dark:hover:bg-gray-600
          "
          onClick={() =>
            router.push(
              isDeleted
                ? `/admin/users/deleted/${user._id}`
                : `/admin/users/view/${user._id}`
            )
          }
        >
          <Eye size={14} /> View
        </button>

        {/* Restore or Edit */}
        {isDeleted ? (
          <button
            onClick={handleRestore}
            disabled={loading}
            className={`
              flex-1 px-3 py-2 rounded-lg border
              flex items-center justify-center gap-1 font-medium
              text-sm sm:text-base transition
              bg-gray-200 dark:bg-gray-700 
              text-gray-800 dark:text-gray-200
              border-gray-400 dark:border-gray-600
              hover:bg-gray-300 dark:hover:bg-gray-600
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Restoring...
              </>
            ) : (
              <>
                <Undo2 size={14} /> Restore
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push(`/admin/users/edit/${user._id}`)}
            className="
              flex-1 px-3 py-2 rounded-lg border
              flex items-center justify-center gap-1 font-medium
              text-sm sm:text-base transition
              bg-gray-200 dark:bg-gray-700 
              text-gray-800 dark:text-gray-200
              border-gray-400 dark:border-gray-600
              hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  );
}
