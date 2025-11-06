"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkEmail, checkUsername } from "@/lib/authentication";
import {
  Trash2,
  Lock,
  Unlock,
  Save,
  UserCircle2,
  Mail,
  Shield,
  Calendar,
  ImageOff,
} from "lucide-react";
import { updateUserDetails, FreezeUser, deleteUserById } from "@/lib/adminServices";

export default function EditUserPage({ user }) {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checking, setChecking] = useState(false);
  const [fieldError, setFieldError] = useState({ username: "", email: "" });
  const [actionLoading, setActionLoading] = useState("");

  // ✅ Ensure balance field always exists
  useEffect(() => {
    if (user) {
      const userWithBalance = {
        ...user,
        balance:
          user.balance !== undefined && user.balance !== null
            ? user.balance
            : 0,
      };
      setForm(userWithBalance);
    }
  }, [user]);

  // 🟠 Handle input change with validation
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");

    if (["username", "email"].includes(name)) {
      setChecking(true);
      try {
        let exists = false;

        if (name === "username") {
          const res = await checkUsername(value);
          exists = res?.exists || res?.status === true;
        }

        if (name === "email") {
          const res = await checkEmail(value);
          exists = res?.exists || res?.status === true;
        }

        const isOwnValue =
          user[name]?.toLowerCase?.() === value?.toLowerCase?.();

        setFieldError((prev) => ({
          ...prev,
          [name]: exists && !isOwnValue ? `${name} already in use` : "",
        }));
      } catch (err) {
        console.error(err);
        setFieldError((prev) => ({ ...prev, [name]: "Error checking" }));
      } finally {
        setChecking(false);
      }
    }
  };

  // 🟣 Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fieldError.username || fieldError.email) {
      setError("Fix the highlighted errors first.");
      return;
    }

    try {
      const res = await updateUserDetails(user._id, form);
      if (!res.success) {
        setError(res.error || "Failed to update user.");
        return;
      }

      setSuccess("User updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving.");
    }
  };

  // 🔴 Delete user
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user permanently?")) return;
    setActionLoading("delete");
    try {
      const res = await deleteUserById(user._id);
      if (!res.success) throw new Error("Failed to delete user");
      alert("User deleted successfully!");
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    } finally {
      setActionLoading("");
    }
  };

  // 🔒 Freeze / Unfreeze user
  const toggleFreeze = async (freeze) => {
    setActionLoading(freeze ? "freeze" : "unfreeze");

    try {
      const res = user.frozen
        ? await FreezeUser(user._id, false)
        : await FreezeUser(user._id, true);
      if (!res.success) throw new Error("Failed to update user status");
      setForm((prev) => ({ ...prev, frozen: freeze }));
      setSuccess(
        freeze
          ? "User account frozen successfully."
          : "User account reactivated."
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update user status.");
    } finally {
      setActionLoading("");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-500 text-lg">
        Loading user...
      </div>
    );

  const profilePic = form.profilePic || form.avatar || form.image || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0c] via-[#0d0d10] to-[#141414] text-gray-100 p-6 sm:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
          <UserCircle2 size={28} /> Edit User
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
        >
          Back
        </button>
      </div>

      {/* Profile Overview */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 bg-[#151515]/80 border border-yellow-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(255,215,0,0.05)]">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-500/30 shadow-md">
          {profilePic ? (
            <img
              src={profilePic}
              alt="User Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-700/40 to-yellow-400/20 flex items-center justify-center">
              <ImageOff size={48} className="text-yellow-400/70" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-yellow-400">
            {form.username || "Unnamed User"}
          </h2>
          <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 mt-2">
            <Mail size={16} /> {form.email || "No Email"}
          </p>
          <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
            <Shield size={16} /> Role:{" "}
            <span className="capitalize text-yellow-300">
              {form.role || "user"}
            </span>
          </p>
          <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
            <Calendar size={16} /> Joined:{" "}
            {form.createdAt
              ? new Date(form.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => toggleFreeze(!form.frozen)}
          disabled={actionLoading === "freeze" || actionLoading === "unfreeze"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            form.frozen
              ? "bg-blue-700/40 hover:bg-blue-700/60 text-blue-300 border border-blue-500/30"
              : "bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30"
          }`}
        >
          {actionLoading === "freeze" || actionLoading === "unfreeze"
            ? "Updating..."
            : form.frozen
            ? (
              <>
                <Unlock size={16} /> Unfreeze Account
              </>
            )
            : (
              <>
                <Lock size={16} /> Freeze Account
              </>
            )}
        </button>

        <button
          onClick={handleDelete}
          disabled={actionLoading === "delete"}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/30 hover:bg-red-700/50 text-red-300 border border-red-500/30 transition"
        >
          {actionLoading === "delete" ? "Deleting..." : (<><Trash2 size={16} /> Delete User</>)}
        </button>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#151515]/70 border border-yellow-500/20 p-6 rounded-2xl shadow-[0_0_10px_rgba(255,215,0,0.05)]"
      >
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1 capitalize">
              {key.replace(/_/g, " ")}
            </label>

            {key === "password" ? (
              <>
                <input
                  type="text"
                  name={key}
                  value={value === false ? "false" : value || ""}
                  onFocus={() => setForm((prev) => ({ ...prev, password: "" }))}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="bg-[#1a1a1a] border border-yellow-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Click to reset password. Leave blank to keep existing one.
                </p>
              </>
            ) : (
              <input
                type="text"
                name={key}
                value={
                  typeof value === "boolean" ? value.toString() : value || ""
                }
                onChange={handleChange}
                readOnly={!["username", "email", "balance"].includes(key)}
                className="bg-[#1a1a1a] border border-yellow-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-gray-100"
              />
            )}

            {fieldError[key] && (
              <p className="text-xs text-red-400 mt-1">{fieldError[key]}</p>
            )}
          </div>
        ))}

        {/* Save / Cancel */}
        <div className="sm:col-span-2 lg:col-span-3 flex gap-4 mt-6">
          <button
            type="submit"
            disabled={checking}
            className={`flex items-center justify-center gap-2 ${
              checking
                ? "bg-yellow-400/40 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-black font-semibold px-6 py-2 rounded-lg transition`}
          >
            <Save size={16} />
            {checking ? "Checking..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>

        {/* Status messages */}
        {success && (
          <p className="text-green-400 mt-4 font-medium text-sm col-span-full">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-400 mt-2 font-medium text-sm col-span-full">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
