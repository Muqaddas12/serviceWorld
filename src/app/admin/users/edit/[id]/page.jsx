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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/edituser?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
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

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-500 font-medium mb-1">{key}</label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
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
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
