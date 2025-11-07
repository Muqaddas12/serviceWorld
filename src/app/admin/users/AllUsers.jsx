"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Download } from "lucide-react";
import SearchBar from "./SearchBar";
import ActiveUsersList from "./ActiveUsersList";
import DeletedUsersList from "./DeletedUsersList";
import ExportPopup from "./ExportPopup"; // ✅ Add this import

export default function AllUsers({ users = [], dusers = [] }) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredDeleted, setFilteredDeleted] = useState(dusers);
  const [search, setSearch] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const debounceRef = useRef(null);

  // 🔍 Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const lower = search.toLowerCase();
      if (!search) {
        setFilteredUsers(users);
        setFilteredDeleted(dusers);
      } else {
        const match = (u) =>
          Object.values(u).some((v) => String(v).toLowerCase().includes(lower));
        setFilteredUsers(users.filter(match));
        setFilteredDeleted(dusers.filter(match));
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, users, dusers]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 px-6 py-8 relative overflow-hidden">
      {/* 🎨 Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(128,90,213,0.05),transparent_70%)] pointer-events-none" />

      {/* 🧱 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400/10 p-2 rounded-xl">
            <Users className="text-yellow-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              User Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage active and deleted user records
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExportPopup(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* 🔍 Search */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* 🟢 Active + 🔴 Deleted Users */}
      <ActiveUsersList users={filteredUsers} />
      <DeletedUsersList dusers={filteredDeleted} />

      {/* 📤 Export Modal */}
      {showExportPopup && (
        <ExportPopup
          users={filteredUsers}
          dusers={filteredDeleted}
          onClose={() => setShowExportPopup(false)}
        />
      )}
    </div>
  );
}
