"use client";

import { useState } from "react";
import { Eye, Edit3, Mail, Shield, Users, Trash2, Undo2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { restoreUserById } from "@/lib/adminServices";

export default function UserCard({ user, type }) {
  const router = useRouter();
  const isDeleted = type === "deleted";
  const [loading, setLoading] = useState(false);

  // ♻️ Handle Restore
  const handleRestore = async () => {
    if (!user?._id) return alert("❌ User ID missing.");

    if (!confirm(`Are you sure you want to restore ${user.username || "this user"}?`))
      return;

    try {
      setLoading(true);
      const res = await restoreUserById(user._id);

      if (res.error) {
        alert("❌ " + res.error);
        return;
      }

      alert("✅ User restored successfully!");
      router.refresh(); // Refresh the current page data
    } catch (err) {
      console.error("Restore error:", err);
      alert("❌ Failed to restore user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`group relative backdrop-blur-md rounded-2xl p-5 sm:p-6 transition-all duration-500 overflow-hidden ${
        isDeleted
          ? "bg-[#1a0f0f]/70 border border-red-500/10 hover:border-red-500/30 hover:shadow-[0_0_25px_rgba(255,0,0,0.15)]"
          : "bg-[#141415]/70 border border-yellow-500/10 hover:border-yellow-500/30 hover:shadow-[0_0_25px_rgba(255,215,0,0.15)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              isDeleted ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {isDeleted ? <Trash2 size={18} /> : <Users size={18} />}
          </div>
          <h2 className="font-semibold text-base sm:text-lg truncate max-w-[10rem]">
            {user.username || (isDeleted ? "Deleted User" : "Unknown User")}
          </h2>
        </div>
        <span
          className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase ${
            isDeleted ? "bg-red-500/20 text-red-200" : "bg-yellow-500/20 text-yellow-200"
          }`}
        >
          {isDeleted ? "Deleted" : user.role || "user"}
        </span>
      </div>

      {/* Info */}
      <div className="text-xs sm:text-sm text-gray-400 space-y-2 mb-5">
        <p className="flex items-center gap-2 truncate">
          <Mail size={14} className={isDeleted ? "text-red-500/60" : "text-yellow-500/60"} />
          {user.email || "No Email"}
        </p>
        <p className="flex items-center gap-2 truncate">
          <Shield size={14} className={isDeleted ? "text-red-500/60" : "text-yellow-500/60"} />
          {user._id}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        <button
          className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base border transition-all duration-300 ${
            isDeleted
              ? "border-red-500/30 text-red-300 bg-red-600/40 hover:bg-red-600/60"
              : "border-yellow-500/30 text-yellow-300 bg-yellow-600/40 hover:bg-yellow-600/60"
          }`}
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

        {isDeleted ? (
          <button
            onClick={handleRestore}
            disabled={loading}
            className={`flex-1 bg-green-600/40 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600/70"
            }`}
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
            className="flex-1 bg-indigo-600/40 hover:bg-indigo-600/70 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300"
          >
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  );
}
