"use client";
import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
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
  );
}
