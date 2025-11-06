"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Edit3,
  Users,
  Mail,
  Shield,
  Trash2,
  Undo2,
  Download,
  X,
} from "lucide-react";

export default function AllUsers({ users = [], dusers = [] }) {
  const router = useRouter();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredDeleted, setFilteredDeleted] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [exportType, setExportType] = useState("active");
  const [selectedFields, setSelectedFields] = useState(["username", "email", "role"]);
  const debounceRef = useRef(null);

  // detect all possible fields dynamically
  const allFields = Array.from(
    new Set([
      ...users.flatMap((u) => Object.keys(u || {})),
      ...dusers.flatMap((u) => Object.keys(u || {})),
    ])
  ).filter((f) => !["__v", "password", "salt"].includes(f)); // hide sensitive fields

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const lower = search.toLowerCase();
      if (!search) {
        setFilteredUsers(users);
        setFilteredDeleted(dusers);
      } else {
        setFilteredUsers(
          users.filter((u) =>
            Object.values(u).some((v) => String(v).toLowerCase().includes(lower))
          )
        );
        setFilteredDeleted(
          dusers.filter((u) =>
            Object.values(u).some((v) => String(v).toLowerCase().includes(lower))
          )
        );
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, users, dusers]);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredDeleted(dusers);
  }, [users, dusers]);

  // 🧩 Generate CSV for selected fields
  const exportToCSV = (data, filename, fields) => {
    if (!data.length) {
      alert("No data to export.");
      return;
    }

    const csv = [
      fields.join(","),
      ...data.map((row) =>
        fields
          .map((f) => {
            const val = row[f];
            if (val === undefined || val === null) return "";
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // 🧠 Handle export
  const handleFinalExport = () => {
    setShowExportPopup(false);
    let data = [];
    if (exportType === "active") data = filteredUsers;
    else if (exportType === "deleted") data = filteredDeleted;
    else data = [...filteredUsers, ...filteredDeleted];
    exportToCSV(data, `${exportType}_users.csv`, selectedFields);
  };

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 px-6 py-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(128,90,213,0.05),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400/10 p-2 rounded-xl">
            <Users className="text-yellow-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">User Management</h1>
            <p className="text-gray-400 text-sm">
              Manage active and deleted user records
            </p>
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={() => setShowExportPopup(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-10 max-w-lg relative z-10 w-full">
        <div className="flex items-center bg-[#151517]/70 border border-yellow-500/30 rounded-2xl px-4 shadow-md focus-within:border-yellow-400 transition">
          <Search size={18} className="text-yellow-400 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-200 py-3 focus:outline-none placeholder-gray-500"
          />
        </div>
      </div>

    {/* 🟢 Active Users */}
      <section className="mb-12 relative z-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          <Users size={18} /> Active Users ({filteredUsers.length})
        </h2>

        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">No active users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-7">
            {filteredUsers.map((user, i) => (
              <div
                key={user._id || i}
                className="group relative bg-[#141415]/70 backdrop-blur-md border border-yellow-500/10 rounded-2xl p-5 sm:p-6 shadow-[0_0_10px_rgba(255,215,0,0.05)] hover:shadow-[0_0_25px_rgba(255,215,0,0.15)] hover:border-yellow-500/30 transition-all duration-500 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="bg-yellow-500/20 text-yellow-400 p-2 rounded-full">
                      <Users size={18} />
                    </div>
                    <h2 className="font-semibold text-base sm:text-lg truncate max-w-[8rem] sm:max-w-[10rem]">
                      {user.username || "Unknown User"}
                    </h2>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-yellow-500/30 to-yellow-400/30 text-yellow-200 px-2 py-0.5 sm:py-1 rounded-full uppercase">
                    {user.role || "user"}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-400 space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 relative z-10">
                  <p className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-yellow-500/60 shrink-0" />{" "}
                    {user.email || "No Email"}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Shield size={14} className="text-yellow-500/60 shrink-0" />{" "}
                    <span className="truncate">{user._id}</span>
                  </p>
                </div>

                <div className="flex gap-2.5 relative z-10">
                  <button
                    className="flex-1 bg-gradient-to-r from-yellow-600/40 to-yellow-500/30 hover:from-yellow-600/70 hover:to-yellow-500/50 border border-yellow-500/30 text-yellow-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300"
                    onClick={() => router.push(`/admin/users/view/${user._id}`)}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-indigo-600/40 to-purple-500/30 hover:from-indigo-600/70 hover:to-purple-500/50 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300"
                    onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔴 Deleted Users */}
      <section className="relative z-10">
        <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
          <Trash2 size={18} /> Deleted Users ({filteredDeleted.length})
        </h2>

        {filteredDeleted.length === 0 ? (
          <p className="text-gray-500">No deleted users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-7">
            {filteredDeleted.map((user, i) => (
              <div
                key={user._id || i}
                className="group relative bg-[#1a0f0f]/70 backdrop-blur-md border border-red-500/10 rounded-2xl p-5 sm:p-6 shadow-[0_0_10px_rgba(255,0,0,0.05)] hover:shadow-[0_0_25px_rgba(255,0,0,0.15)] hover:border-red-500/30 transition-all duration-500 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="bg-red-500/20 text-red-400 p-2 rounded-full">
                      <Trash2 size={18} />
                    </div>
                    <h2 className="font-semibold text-base sm:text-lg truncate max-w-[8rem] sm:max-w-[10rem]">
                      {user.username || "Deleted User"}
                    </h2>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-red-500/30 to-red-400/30 text-red-200 px-2 py-0.5 sm:py-1 rounded-full uppercase">
                    Deleted
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-400 space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 relative z-10">
                  <p className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-red-500/60 shrink-0" />{" "}
                    {user.email || "No Email"}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Shield size={14} className="text-red-500/60 shrink-0" />{" "}
                    <span className="truncate">{user._id}</span>
                  </p>
                </div>

                <div className="flex gap-2.5 relative z-10">
                  <button
                    className="flex-1 bg-gradient-to-r from-red-600/40 to-orange-500/30 hover:from-red-600/70 hover:to-orange-500/50 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300"
                    onClick={() => router.push(`/admin/users/deleted/${user._id}`)}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-green-600/40 to-teal-500/30 hover:from-green-600/70 hover:to-teal-500/50 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-medium text-sm sm:text-base transition-all duration-300"
                  >
                    <Undo2 size={14} /> Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🟡 Export Popup Modal */}
      {showExportPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setShowExportPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
              Export Users
            </h2>

            {/* Select Type */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">
                Select Type:
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full bg-[#0a0a0b] border border-yellow-500/30 text-gray-200 rounded-lg px-3 py-2"
              >
                <option value="active">Active Users</option>
                <option value="deleted">Deleted Users</option>
                <option value="both">All Users</option>
              </select>
            </div>

            {/* Select Fields */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Select Fields to Export:
              </label>
              <div className="max-h-40 overflow-y-auto border border-yellow-500/10 rounded-lg p-3 bg-[#0a0a0b]/50">
                {allFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 py-1 text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() =>
                        setSelectedFields((prev) =>
                          prev.includes(field)
                            ? prev.filter((f) => f !== field)
                            : [...prev, field]
                        )
                      }
                      className="accent-yellow-500"
                    />
                    {field}
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExportPopup(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalExport}
                className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}