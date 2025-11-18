"use client";

import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ServicesPage({ services }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);

  // Filtering logic
  const filtered = useMemo(() => {
    return services.filter((srv) => {
      const s = search.toLowerCase();

      const matchesSearch =
        srv.name?.toLowerCase().includes(s) ||
        srv.desc?.toLowerCase().includes(s) ||
        srv.service?.toString().includes(s);

      const matchesCategory =
        selectedCategory === "All" ||
        srv.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, services]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((srv) => {
      const cat = srv.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(srv);
    });
    return groups;
  }, [filtered]);

  const allCategories = [
    "All",
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen px-3 sm:px-6 lg:px-10 py-8 bg-gray-100 text-gray-800 dark:bg-[#0F1117] dark:text-gray-200 transition-all">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          All Services
        </h1>

        {/* 🔍 Search */}
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none
              bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-400
              dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-200 dark:focus:ring-gray-600"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg py-2 px-3 text-sm outline-none
            bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-400
            dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-300 dark:focus:ring-gray-600
            w-full sm:w-auto"
        >
          {allCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE WRAPPER */}
      <div className="rounded-2xl shadow-lg overflow-hidden border
        bg-white border-gray-300
        dark:bg-[#1A1C1F] dark:border-gray-700">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-200 text-gray-900 border-gray-300 dark:bg-[#1E1F23] dark:text-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Rate</th>
                <th className="px-4 py-3 text-left">Min</th>
                <th className="px-4 py-3 text-left">Max</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(grouped).length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No services found.
                  </td>
                </tr>
              )}

              {Object.keys(grouped).map((category) => (
                <React.Fragment key={category}>
                  
                  {/* Category Row */}
                  <tr className="bg-gray-200 text-gray-800 dark:bg-[#1E1F23] dark:text-gray-200">
                    <td colSpan={7} className="px-4 py-3 font-bold text-lg">
                      {category}
                    </td>
                  </tr>

                  {/* Service Rows */}
                  {grouped[category].map((srv) => (
                    <tr
                      key={srv.service}
                      className="border-b transition
                        border-gray-300 hover:bg-gray-100
                        dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">{srv.service}</td>
                      <td className="px-4 py-3">{srv.name}</td>
                      <td className="px-4 py-3">₹{srv.rate}</td>
                      <td className="px-4 py-3">{srv.min}</td>
                      <td className="px-4 py-3">{srv.max}</td>

                      {/* Status Badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-md
                            ${srv.status === "Enabled"
                              ? "bg-green-300/20 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-300/20 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                        >
                          {srv.status}
                        </span>
                      </td>

                      {/* View Button */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedService(srv)}
                          className="px-4 py-1 text-xs border rounded-md
                            border-gray-400 text-gray-700 hover:bg-gray-200
                            dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
                            transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden">
          {Object.keys(grouped).map((category) => (
            <div key={category}>
              
              <h2 className="px-4 py-3 font-bold bg-gray-200 text-gray-800 dark:bg-[#1E1F23] dark:text-gray-200">
                {category}
              </h2>

              {grouped[category].map((srv) => (
                <div
                  key={srv.service}
                  className="p-4 border-b
                    border-gray-300 hover:bg-gray-100
                    dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <h3 className="font-semibold text-lg">{srv.name}</h3>
                  <p className="text-sm">ID: {srv.service}</p>
                  <p className="text-sm">Rate: ₹{srv.rate}</p>
                  <p className="text-sm">
                    Min: {srv.min} | Max: {srv.max}
                  </p>

                  <button
                    onClick={() => setSelectedService(srv)}
                    className="mt-2 px-3 py-1 text-xs border rounded-md
                      border-gray-400 hover:bg-gray-200
                      dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="max-w-lg w-full p-6 rounded-2xl shadow-lg border
            bg-white border-gray-300 text-gray-800
            dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-200 relative"
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-3">
              {selectedService.name}
            </h2>

            <p className="text-sm mb-4 opacity-80">
              {selectedService.desc || "No description provided."}
            </p>

            <div className="space-y-2 text-sm">
              <p><strong>Category:</strong> {selectedService.category}</p>
              <p><strong>Rate:</strong> ₹{selectedService.rate}</p>
              <p><strong>Min:</strong> {selectedService.min} | <strong>Max:</strong> {selectedService.max}</p>
              <p><strong>Status:</strong> {selectedService.status}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 rounded-md border
                  border-gray-400 text-gray-700 hover:bg-gray-200
                  dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
