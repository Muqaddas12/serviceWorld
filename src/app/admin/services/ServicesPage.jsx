"use client";

import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import AddNewService from "./AddNewService";
import ServiceTable from "./ServiceTable";
import ServiceModal from "./ServiceModal";
import { useRouter } from "next/navigation";
export default function ServicesPage({ services }) {
  const router=useRouter()
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);

  /* ---------------- FILTERING ---------------- */
  const filtered = useMemo(() => {
    return services.filter((srv) => {
      const s = search.toLowerCase();

      const matchesSearch =
        srv.name?.toLowerCase().includes(s) ||
        srv.description?.toLowerCase().includes(s) ||
        srv.id?.toString().includes(s);

      const matchesCategory =
        selectedCategory === "All" ||
        srv.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, services]);

  /* ---------------- GROUPING BY CATEGORY ---------------- */
  const groupedNormal = useMemo(() => {
    const groups = {};
    filtered
      .filter((s) => !s.customservice)
      .forEach((srv) => {
        const cat = srv.category || "Uncategorized";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(srv);
      });
    return groups;
  }, [filtered]);

  const groupedCustom = useMemo(() => {
    const groups = {};
    filtered
      .filter((s) => s.customservice === true)
      .forEach((srv) => {
        const cat = srv.category || "Custom Services";
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
    <div className="min-h-screen   py-8 bg-gray-100 text-gray-800 dark:bg-[#0F1117] dark:text-gray-200 transition-all">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          All Services
        </h1>

   

        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-400 dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-200 dark:focus:ring-gray-600"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-gray-400 dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-300 dark:focus:ring-gray-600 w-full sm:w-auto"
        >
          {allCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      <div className="flex justify-center flex-col">
               <AddNewService />
                 <button
  onClick={() =>router.push('/admin/ImportServices') }
  className="width-[90%] py-2 bg-gray-800 text-white text-sm rounded-lg shadow hover:bg-gray-700 inline"
>
  Import services
</button>

      </div>
      </div>

      {/* TABLE: API SERVICES */}
      <ServiceTable
        title="API Services"
        grouped={groupedNormal}
        custom={false}
        setSelectedService={setSelectedService}
      />

      {/* TABLE: CUSTOM SERVICES */}
      <ServiceTable
        title="Custom Services"
        grouped={groupedCustom}
        custom={true}
        setSelectedService={setSelectedService}
      />

      {/* MODAL */}
      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
