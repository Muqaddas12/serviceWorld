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
  Copy,
} from "lucide-react";
import {
  updateUserDetails,
  FreezeUser,
  deleteUserById,
} from "@/lib/adminServices";

export default function EditUserPage({ user }) {
  console.log(user)
  const router = useRouter();
  const [form, setForm] = useState({});
  const [fieldError, setFieldError] = useState({ username: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checking, setChecking] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

// Ensure balance & discount always exist
useEffect(() => {
  if (user) {
    setForm({
      ...user,
      balance:
        user.balance !== undefined && user.balance !== null
          ? user.balance
          : 0,
      discount:
        user.discount !== undefined && user.discount !== null
          ? user.discount
          : 0,
    });
  }
}, [user]);


  // Handle input change + validation
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccess("");

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

        const isOwn =
          user[name]?.toLowerCase?.() === value?.toLowerCase?.();

        setFieldError((prev) => ({
          ...prev,
          [name]: exists && !isOwn ? `${name} already in use` : "",
        }));
      } catch {
        setFieldError((p) => ({ ...p, [name]: "Error checking" }));
      } finally {
        setChecking(false);
      }
    }
  };

  // Save User
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fieldError.username || fieldError.email) {
      setError("Fix the errors first.");
      return;
    }

    try {
      const res = await updateUserDetails(user._id, form);
      if (!res.success) return setError(res.error || "Failed to update user.");

      setSuccess("User updated successfully.");
    } catch {
      setError("Something went wrong while saving.");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!confirm("Delete this user permanently?")) return;

    setActionLoading("delete");
    try {
      const res = await deleteUserById(user._id);
      if (!res.success) throw new Error();

      alert("User deleted.");
      router.push("/admin/users");
    } catch {
      setError("Failed to delete user.");
    } finally {
      setActionLoading("");
    }
  };

  // Freeze / Unfreeze
  const toggleFreeze = async () => {
    const freezing = !form.frozen;
    setActionLoading("freeze");

    try {
      const res = await FreezeUser(user._id, freezing);
      if (!res.success) throw new Error();

      setForm((p) => ({ ...p, frozen: freezing }));
      setSuccess(
        freezing ? "User account frozen." : "User account reactivated."
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setActionLoading("");
    }
  };
const handleDiscountChange=async()=>{

}
  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        Loading user...
      </div>
    );

  const profilePic = form.profilePic || form.avatar || form.image || null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f11] text-gray-900 dark:text-gray-200 p-6 sm:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCircle2 size={28} /> Edit User
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>

      {/* Profile Summary */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 bg-white dark:bg-[#151517] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          {profilePic ? (
            <img src={profilePic} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <ImageOff size={48} className="text-gray-500 dark:text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-semibold">
            {form.username || "User"}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 flex gap-2 items-center mt-2">
            <Mail size={16} /> {form.email || "No Email"}
          </p>

          <p className="text-gray-500 dark:text-gray-400 flex gap-2 items-center mt-1">
            <Shield size={16} /> Role:{" "}
            <span className="capitalize">{form.role || "user"}</span>
          </p>

          <p className="text-gray-500 dark:text-gray-400 flex gap-2 items-center mt-1">
            <Calendar size={16} /> Joined:{" "}
            {form.createdAt ? new Date(form.createdAt).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Freeze / Unfreeze */}
        <button
          onClick={toggleFreeze}
          disabled={actionLoading === "freeze"}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {actionLoading === "freeze"
            ? "Updating..."
            : form.frozen
            ? (
                <>
                  <Unlock size={16} /> Unfreeze
                </>
              )
            : (
                <>
                  <Lock size={16} /> Freeze
                </>
              )}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={actionLoading === "delete"}
          className="flex items-center gap-2 bg-red-200 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-300 dark:hover:bg-red-800 transition"
        >
          {actionLoading === "delete" ? "Deleting..." : <><Trash2 size={16} /> Delete</>}
        </button>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-white dark:bg-[#151517] border border-gray-300 dark:border-gray-700 p-6 rounded-2xl shadow-sm"
      >

        {/* Copy All Fields */}
        <div className="col-span-full flex justify-end">
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(form, null, 2))
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Copy size={16} />
            Copy All Fields
          </button>
        </div>

        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block capitalize">
              {key.replace(/_/g, " ")}
            </label>

            <div className="relative flex items-center">
           
              {key === "password" ? (
                <input
                  type="text"
                  name={key}
                  value={value === false ? "false" : value || ""}
                  onFocus={() => setForm((p) => ({ ...p, password: "" }))}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full bg-gray-100 dark:bg-[#1a1a1c] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <input
                  type={key==='discount'?'number':"text"}
                  name={key}
                  readOnly={!["username", "email", "balance","discount"].includes(key)}
                  value={
                    typeof value === "boolean" ? value.toString() : value || ""
                  }
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-[#1a1a1c] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
              )}

              {/* Copy Icon inside input */}
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(String(value))}
                className="absolute right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <Copy size={16} />
              </button>
            </div>

            {fieldError[key] && (
              <p className="text-xs text-red-500 mt-1">{fieldError[key]}</p>
            )}
          </div>
        ))}

        {/* Save & Cancel Buttons */}
        <div className="col-span-full flex gap-4 mt-6">
          <button
            type="submit"
            disabled={checking}
            className="flex items-center gap-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black px-6 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition"
          >
            <Save size={16} />
            {checking ? "Checking..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>

        {/* Messages */}
        {success && (
          <p className="col-span-full mt-4 text-green-600 dark:text-green-400 text-sm font-medium">
            {success}
          </p>
        )}
        {error && (
          <p className="col-span-full mt-2 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
