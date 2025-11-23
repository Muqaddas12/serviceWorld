"use client";
import { useRouter } from "next/navigation";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaTelegramPlane,
  FaGlobe,
} from "react-icons/fa";

import SearchBar from "./SearchBar";
import ServiceCard from "./ServiceCard";
import ViewModal from "./ViewModal";


export default function ServicesList({ services = [] }) {
  const router= useRouter()
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Group by platform
  const groupedServices = useMemo(() => {
    const groups = {
      Instagram: [],
      YouTube: [],
      Facebook: [],
      TikTok: [],
      Telegram: [],
      Other: [],
    };

    for (const s of services) {
      const name = s.name?.toLowerCase() || "";
      if (name.includes("instagram")) groups.Instagram.push(s);
      else if (name.includes("youtube")) groups.YouTube.push(s);
      else if (name.includes("facebook")) groups.Facebook.push(s);
      else if (name.includes("tiktok")) groups.TikTok.push(s);
      else if (name.includes("telegram")) groups.Telegram.push(s);
      else groups.Other.push(s);
    }

    return Object.fromEntries(
      Object.entries(groups).filter(([_, v]) => v.length > 0)
    );
  }, [services]);

  // Debounce
  useEffect(() => {
    setLoadingSearch(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setLoadingSearch(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter services
  const filteredGroupedServices = useMemo(() => {
    const filtered = {};
    for (const [category, list] of Object.entries(groupedServices)) {
      const filteredList = list.filter(
        (s) =>
          !debouncedSearch ||
          s.name.toLowerCase().includes(debouncedSearch) ||
          (s.description &&
            s.description.toLowerCase().includes(debouncedSearch))
      );
      if (filteredList.length > 0) filtered[category] = filteredList;
    }
    return filtered;
  }, [groupedServices, debouncedSearch]);

  // Icons (recolored to new theme)
  const getIconForService = (name = "") => {
    const lower = name.toLowerCase();

    if (lower.includes("instagram"))
      return <FaInstagram className="text-[#E1306C] text-2xl" />;

    if (lower.includes("youtube"))
      return <FaYoutube className="text-[#FF0000] text-2xl" />;

    if (lower.includes("facebook"))
      return <FaFacebook className="text-[#1877F2] text-2xl" />;

    if (lower.includes("tiktok"))
      return <FaTiktok className="text-white text-2xl" />;

    if (lower.includes("telegram"))
      return <FaTelegramPlane className="text-[#2AABEE] text-2xl" />;

    return <FaGlobe className="text-[#16D1A5] text-2xl" />;
  };

  return (
    <>
 

      <div className="
        min-h-screen flex px-4 py-10
        bg-[#F5F7FA] text-[#1A1A1A]
        dark:bg-[#0F1117] dark:text-white
      ">
        <div className="w-full max-w-[1200px]">

          {/* Heading */}
          <h1
            className="
              text-3xl md:text-4xl font-bold text-center mb-10
              text-[#4A6CF7]
              dark:text-[#4A6CF7]
            "
          >
            💎 Available Services
          </h1>

          {/* Search bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loadingSearch={loadingSearch}
          />

          {/* No results */}
          {Object.keys(filteredGroupedServices).length === 0 ? (
            <p className="text-center text-[#4B5563] dark:text-[#A0AEC3]">
              No matching services found.
            </p>
          ) : (
            Object.entries(filteredGroupedServices).map(
              ([category, list]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-10"
                >
                  {/* Category label */}
                  <div className="flex items-center gap-2 mb-4">
                    {getIconForService(category)}

                    <h2 className="text-xl md:text-2xl font-semibold text-[#4A6CF7]">
                      {category}
                    </h2>

                    <span className="text-sm text-[#4B5563] dark:text-[#A0AEC3]">
                      ({list.length})
                    </span>
                  </div>
<div className="overflow-x-auto mt-5">
  <table className="min-w-full border rounded border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1A1C1F]">
    
    <thead className="bg-gray-100 dark:bg-[#2A2C31] text-gray-700 dark:text-gray-300">
      <tr>
        <th className="px-4 py-3 text-left font-semibold">ID</th>
        <th className="px-4 py-3 text-left font-semibold">Service</th>
        <th className="px-4 py-3 text-left font-semibold">Description</th>
        <th className="px-4 py-3 text-left font-semibold">Rate</th>
        <th className="px-4 py-3 text-left font-semibold">Min</th>
        <th className="px-4 py-3 text-left font-semibold">Max</th>
        <th className="px-4 py-3 text-center font-semibold">Action</th>
      </tr>
    </thead>

    <tbody className="text-gray-700 dark:text-gray-300">
      {list.map((service, index) => (
        <ServiceCard
          key={service.service || index}
          service={service}
          getIconForService={getIconForService}
          onSelect={setSelectedService}
        />
      ))}
    </tbody>

  </table>
</div>


                </motion.div>
              )
            )
          )}

          {/* Popup */}
         {selectedService && (
  <ViewModal
    service={selectedService}
    onClose={() => setSelectedService(null)}
  />
)}

        </div>
      </div>
    </>
  );
}
