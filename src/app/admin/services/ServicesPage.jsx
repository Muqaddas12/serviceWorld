"use client";

import { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ServicesPage({ services }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);

  // 🔍 Filter logic
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name?.toLowerCase().includes(search.toLowerCase()) ||
        srv.desc?.toLowerCase().includes(search.toLowerCase()) ||
        srv.service?.toString().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        srv.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, services]);

  // 📊 Category options
  const allCategories = [
    "All",
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 px-3 sm:px-6 lg:px-10 py-8">
      {/* ======= HEADER BAR ======= */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          All Services
        </h1>

        {/* 🔍 Search */}
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151517] border border-yellow-500/20 text-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* 🧭 Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#151517] border border-yellow-500/20 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-yellow-500 text-gray-300 w-full sm:w-auto"
        >
          {allCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ======= RESPONSIVE TABLE ======= */}
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-lg overflow-hidden">
        {/* Desktop/Table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#1a1a1c] text-yellow-400 border-b border-yellow-500/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Service Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Provider</th>
                <th className="px-4 py-3 text-left font-semibold">Rate (₹)</th>
                <th className="px-4 py-3 text-left font-semibold">Min</th>
                <th className="px-4 py-3 text-left font-semibold">Max</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((srv, i) => (
                  <tr
                    key={i}
                    className="hover:bg-yellow-500/10 transition-all border-b border-yellow-500/10"
                  >
                    <td className="px-4 py-3 text-gray-400">{srv.service}</td>
                    <td className="px-4 py-3 font-semibold text-yellow-300">
                      {srv.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{srv.category}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {srv.provider || "default"}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-semibold">
                      ₹{srv.rate}
                    </td>
                    <td className="px-4 py-3">{srv.min}</td>
                    <td className="px-4 py-3">{srv.max}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          srv.status === "Enabled"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {srv.status || "Enabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedService(srv)}
                        className="px-4 py-1 text-xs bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-gray-400 py-6 italic"
                  >
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view (cards) */}
        <div className="md:hidden divide-y divide-yellow-500/10">
          {filteredServices.length > 0 ? (
            filteredServices.map((srv, i) => (
              <div
                key={i}
                className="p-4 hover:bg-[#1a1a1c] transition flex flex-col gap-2"
              >
                <h3 className="font-semibold text-yellow-300 text-lg">
                  {srv.name}
                </h3>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    <span className="text-yellow-400 font-medium">ID:</span>{" "}
                    {srv.service}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      srv.status === "Enabled"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {srv.status || "Enabled"}
                  </span>
                </div>

                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">
                    Category:
                  </span>{" "}
                  {srv.category || "Uncategorized"}
                </p>

                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">Provider:</span>{" "}
                  {srv.provider || "default"}
                </p>

                <p className="text-sm text-green-400">
                  <span className="text-yellow-400 font-medium">Rate:</span> ₹
                  {srv.rate}
                </p>

                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400 font-medium">Min:</span>{" "}
                  {srv.min}{" "}
                  <span className="text-yellow-400 font-medium">| Max:</span>{" "}
                  {srv.max}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="px-3 py-1 text-xs bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6 italic">
              No services found.
            </div>
          )}
        </div>
      </div>

      {/* ======= POPUP MODAL ======= */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl max-w-lg w-full p-6 relative shadow-[0_0_25px_rgba(234,179,8,0.2)]">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-yellow-400 mb-3">
              {selectedService.name}
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              {selectedService.desc || "No description available."}
            </p>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium text-yellow-400">Category:</span>{" "}
                {selectedService.category || "Uncategorized"}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Type:</span>{" "}
                {selectedService.type || "Default"}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Provider:</span>{" "}
                {selectedService.provider || "N/A"}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Rate:</span> ₹
                {selectedService.rate}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Min:</span>{" "}
                {selectedService.min} |{" "}
                <span className="font-medium">Max:</span>{" "}
                {selectedService.max}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Status:</span>{" "}
                {selectedService.status || "Enabled"}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-semibold hover:bg-yellow-500/30 transition-all duration-300"
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
