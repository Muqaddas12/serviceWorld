"use client";

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
import BuyPopup from "./BuyPopup";
import { useCurrency } from "@/context/CurrencyContext";
export default function ServicesList({ services = [] }) {
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { currency, updateCurrency, symbol, convert } = useCurrency();
  // Group services
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

  // Debounced search
  useEffect(() => {
    setLoadingSearch(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setLoadingSearch(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter services by search term
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

  // Neutral icon colors
  const getIconForService = () => (
    <FaGlobe className="text-gray-600 dark:text-gray-300 text-2xl" />
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-100 flex justify-center px-3 md:px-8 py-10">
      <div className="w-full max-w-[1200px]">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
          Available Services
          
        </h1>

        {/* Search */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loadingSearch={loadingSearch}
        />
 {/* Currency Selector */}
     <div className="flex justify-end">
       <select
        value={currency}
        onChange={(e) => updateCurrency(e.target.value)}
        className="
         flex flex-end rounded-lg px-3 py-1 text-sm focus:outline-none cursor-pointer
          bg-white text-gray-700 border border-gray-300 focus:border-gray-500
          dark:bg-[#1A1F2B] dark:text-gray-300 dark:border-gray-700 dark:focus:border-gray-500
        "
      >
        <option value="INR">INR ₹</option>
        <option value="USD">USD $</option>
        <option value="EUR">EUR €</option>
      </select>
     </div>
        {/* No results */}
        {Object.keys(filteredGroupedServices).length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No matching services found.
          </p>
        ) : (
          Object.entries(filteredGroupedServices).map(([category, list]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              {/* Section Heading */}
              <div className="flex items-center gap-2 mb-4">
                {getIconForService(category)}
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {category}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({list.length})
                </span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((service, index) => (
                  <ServiceCard
                    key={index|| service.service }
                    service={service}
                    getIconForService={getIconForService}
                    onSelect={setSelectedService}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}

        {/* Buy Popup */}
        <AnimatePresence>
          {selectedService && (
            <BuyPopup
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
