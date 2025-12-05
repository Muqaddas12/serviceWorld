"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Download } from "lucide-react";
import SearchBar from "./SearchBar";
import ActiveUsersList from "./ActiveUsersList";
import DeletedUsersList from "./DeletedUsersList";
import ExportPopup from "./ExportPopup";
import SendMessageModal from "./SendMessageModal";
export default function AllUsers({ users = [], dusers = [] }) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredDeleted, setFilteredDeleted] = useState(dusers);
  const [search, setSearch] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const debounceRef = useRef(null);

const [lastSentResult, setLastSentResult] = useState(null);
const [sendMessage,setSendMessage]=useState(false)
  /* 🔍 Debounced search */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const lower = search.toLowerCase();

      if (!search) {
        setFilteredUsers(users);
        setFilteredDeleted(dusers);
        return;
      }

      const match = (u) =>
        Object.values(u).some((v) => String(v).toLowerCase().includes(lower));

      setFilteredUsers(users.filter(match));
      setFilteredDeleted(dusers.filter(match));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [search, users, dusers]);

  return (
    <div className="
      min-h-screen 
      bg-gray-100 dark:bg-[#0f1117] 
      text-gray-800 dark:text-gray-200 
      px-6 py-8
    ">
      
      {/* Header */}
      <div className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        gap-4 mb-8
      ">
        <div className="flex items-center gap-3">
          <div className="
            bg-gray-300 dark:bg-gray-800 
            p-2 rounded-xl
          ">
            <Users className="text-gray-700 dark:text-gray-300" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage active and deleted user records
            </p>
          </div>
        </div>

        <button
          onClick={() => setSendMessage(true)}

          className="
            flex items-center gap-2 px-4 py-2 
            bg-gray-800 dark:bg-gray-700 
            text-white 
            rounded-lg font-semibold
            hover:bg-gray-700 dark:hover:bg-gray-600 
            transition
          "
        >
          <Download size={16} />
          Send Message
        </button>
        {/* show modal */}
{sendMessage && (
  <SendMessageModal
    users={filteredUsers} // pass currently filtered users (active)
    onClose={() => setSendMessage(false)}
    onSent={(data) => {
      setLastSentResult(data);
      // optionally close modal:
      // setSendMessage(false);
    }}
  />
)}
        <button
          onClick={() => setShowExportPopup(true)}
          className="
            flex items-center gap-2 px-4 py-2 
            bg-gray-800 dark:bg-gray-700 
            text-white 
            rounded-lg font-semibold
            hover:bg-gray-700 dark:hover:bg-gray-600 
            transition
          "
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Active Users */}
      <ActiveUsersList users={filteredUsers} />

      {/* Deleted Users */}
      <DeletedUsersList dusers={filteredDeleted} />

      {/* Export Popup */}
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
