"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checking, setChecking] = useState(false);
  const [fieldError, setFieldError] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/getuser?id=${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "User not found");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setForm(data.user);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    };
    fetchUser();
  }, [id]);

  // Handle field input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setSuccess("");
    setError("");

    // Live validation for username/email uniqueness
    if (["username", "email"].includes(name)) {
      setChecking(true);
      try {
        const res = await fetch(`/api/admin/check?field=${name}&value=${value}&id=${id}`);
        const data = await res.json();
        if (!res.ok) {
          setFieldError((prev) => ({ ...prev, [name]: data.error || "Error checking" }));
        } else {
          setFieldError((prev) => ({ ...prev, [name]: data.exists ? `${name} already in use` : "" }));
        }
      } catch (err) {
        console.error(err);
        setFieldError((prev) => ({ ...prev, [name]: "Error checking" }));
      } finally {
        setChecking(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don’t submit if duplicate username/email found
    if (fieldError.username || fieldError.email) {
      setError("Fix the highlighted errors first");
      return;
    }

    try {
      const res = await fetch(`/api/admin/edituser?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to update user");
        return;
      }
      setSuccess("User updated successfully");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  if (error && !user) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1 capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
              readOnly={!["username", "email"].includes(key)}
              className={`border ${
                fieldError[key]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded px-3 py-2 focus:outline-none focus:ring-2 transition`}
            />
            {fieldError[key] && (
              <p className="text-sm text-red-500 mt-1">{fieldError[key]}</p>
            )}
          </div>
        ))}
        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={checking}
            className={`${
              checking ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded`}
          >
            {checking ? "Checking..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
      {success && <p className="text-green-500 mt-3">{success}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
