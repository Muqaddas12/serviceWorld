"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    };
    fetchUser();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">View User</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(user).map((key) => (
          <div key={key} className="p-4 border rounded bg-gray-50">
            <p className="text-gray-500 font-medium">{key}</p>
            <p className="text-black">{String(user[key])}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.back()}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
}
