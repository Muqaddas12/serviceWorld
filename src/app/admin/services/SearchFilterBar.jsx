"use client";

import { FaSearch } from "react-icons/fa";
import AddNewService from "./AddNewService";

export default function SearchFilterBar({
  search,
  setSearch,
  allCategories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">

      <AddNewService />

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        All Services
      </h1>

      <div className="relative w-full sm:w-1/3">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg py-2 pl-9 pr-3 bg-white text-gray-800 border border-gray-300
                     dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="rounded-lg py-2 px-3 bg-white text-gray-800 border border-gray-300
                   dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-300"
      >
        {allCategories.map((cat, i) => (
          <option key={i} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
