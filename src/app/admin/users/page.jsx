"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);

  // Fetch all users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/admin/getusers", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch users");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!search) {
        setFilteredUsers(users);
        return;
      }
      const lowerSearch = search.toLowerCase();
      const results = users.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredUsers(results);
    }, 300); // debounce delay: 300ms

    return () => clearTimeout(debounceRef.current);
  }, [search, users]);

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!users.length) return <p className="p-6">No users found.</p>;

  const headers = Object.keys(users[0]);

  return (
    <div className="bg-gray-100 text-black min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Users</h1>
      <p className="text-gray-700 mb-6">
        View and manage all users registered on the platform.
      </p>

      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Suggestion Dropdown */}
        {search && filteredUsers.length > 0 && (
          <ul className="absolute z-50 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
            {filteredUsers.slice(0, 10).map((user) => (
              <li
                key={user._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearch(""); // hide suggestions
                  router.push(`/admin/users/view/${user._id}`);
                }}
              >
                {Object.values(user).join(" | ").substring(0, 100)}
                {Object.values(user).join(" | ").length > 100 && "..."}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-300 rounded-lg">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="py-2 px-2 border-b border-gray-300 w-12">#</th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="py-2 px-2 border-b border-gray-300 text-left truncate capitalize w-40"
                  title={header}
                >
                  {header}
                </th>
              ))}
              <th className="py-2 px-2 border-b border-gray-300 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border-b border-gray-300">{index + 1}</td>
                {headers.map((key) => (
                  <td
                    key={key}
                    className="py-2 px-2 border-b border-gray-300 truncate max-w-[10rem]"
                    title={String(user[key])}
                  >
                    {String(user[key])}
                  </td>
                ))}
                <td className="py-2 px-2 border-b border-gray-300 flex gap-2">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/admin/users/view/${user._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
