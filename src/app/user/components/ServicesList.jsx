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
  FaSearch,
} from "react-icons/fa";
import { createOrderAction } from "@/lib/userActions";

export default function ServicesList({ services = [] }) {
  // 🔹 Core states
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🔹 Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  // 🔹 Popup states
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Dropdown ref (for category)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Icons per platform
  const getIconForService = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("instagram"))
      return <FaInstagram className="text-pink-500 text-2xl" />;
    if (lower.includes("youtube"))
      return <FaYoutube className="text-red-500 text-2xl" />;
    if (lower.includes("facebook"))
      return <FaFacebook className="text-blue-500 text-2xl" />;
    if (lower.includes("tiktok"))
      return <FaTiktok className="text-gray-300 text-2xl" />;
    if (lower.includes("telegram"))
      return <FaTelegramPlane className="text-sky-500 text-2xl" />;
    return <FaGlobe className="text-emerald-400 text-2xl" />;
  };

  // 🔹 Group services by platform
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

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(groups).filter(([_, v]) => v.length > 0)
    );
  }, [services]);

  // 🔹 Debounce search (300ms)
  useEffect(() => {
    setLoadingSearch(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setLoadingSearch(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🔹 Filter by category + debounced search
  const filteredGroupedServices = useMemo(() => {
    const filtered = {};
    for (const [category, list] of Object.entries(groupedServices)) {
      if (selectedCategory !== "All" && category !== selectedCategory) continue;

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
  }, [groupedServices, debouncedSearch, selectedCategory]);

  // 🔹 Auto-calculate charge
  useEffect(() => {
    if (selectedService && quantity) {
      const rate = parseFloat(selectedService.rate?.toString().replace(/,/g, ""));
      const qty = parseInt(quantity, 10);
      if (!isNaN(rate) && !isNaN(qty)) {
        setCharge(((rate * qty) / 1000).toFixed(2));
      } else {
        setCharge("");
      }
    } else {
      setCharge("");
    }
  }, [quantity, selectedService]);

  // 🔹 Validate quantity range
  useEffect(() => {
    if (!selectedService || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (qty < selectedService.min)
      setQuantityError(`Minimum allowed quantity is ${selectedService.min}`);
    else if (qty > selectedService.max)
      setQuantityError(`Maximum allowed quantity is ${selectedService.max}`);
    else setQuantityError("");
  }, [quantity, selectedService]);

  // 🔹 Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !link || !quantity || !charge) {
      setResponseMessage("⚠️ Please fill all fields before submitting.");
      setResponseType("error");
      return;
    }
    if (quantityError) {
      setResponseMessage("⚠️ Quantity must be within the allowed range.");
      setResponseType("error");
      return;
    }

    setSubmitting(true);
    setResponseMessage("");

    try {
      const service=selectedService.service
      const res = await createOrderAction(service,link,quantity,charge)
    

      if (!res.success) {
        setResponseMessage('Failed to create order',res?.message||res?.providerError)
      }

      setResponseMessage(`✅ Order created successfully! ID: ${res.orderId}`);
      setResponseType("success");
      setLink("");
      setQuantity("");
      setCharge("");
    } catch (err) {
      setResponseMessage(`❌ ${err.message}`);
      setResponseType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-100 flex justify-center px-3 md:px-8 py-10">
      <div className="w-full max-w-[1200px]">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-yellow-400">
          💎 Available Services
        </h1>

        {/* 🔍 Search Input */}
        <div className="relative w-full sm:w-[90%] mx-auto mb-8">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search service by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#151517] border border-yellow-500/20 text-gray-200 placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
          />
          {loadingSearch && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-spin">
              <FaSearch />
            </div>
          )}
        </div>

        {/* 🧩 Services Grid */}
        {Object.keys(filteredGroupedServices).length === 0 ? (
          <p className="text-center text-gray-400">
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
              <div className="flex items-center gap-2 mb-4">
                {getIconForService(category)}
                <h2 className="text-xl md:text-2xl font-semibold text-yellow-400">
                  {category}
                </h2>
                <span className="text-sm text-gray-500">
                  ({list.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((service, index) => (
                  <motion.div
                    key={service.service || index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-5 transition-all duration-300 hover:border-yellow-400 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {getIconForService(service.name)}
                        <h3 className="text-lg font-semibold text-gray-100">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong className="text-yellow-400">ID:</strong>{" "}
                        {service.service}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong className="text-yellow-400">Rate / 1K:</strong>{" "}
                        ${service.rate}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong className="text-yellow-400">Min:</strong>{" "}
                        {service.min}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong className="text-yellow-400">Max:</strong>{" "}
                        {service.max}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedService(service)}
                      className="mt-4 w-full px-4 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 font-semibold hover:bg-yellow-500/20 hover:border-yellow-400 transition"
                    >
                      Buy
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}

        {/* 💰 Buy Popup */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-3"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-[#151517] border border-yellow-500/20 p-6 rounded-2xl max-w-md w-full shadow-2xl text-gray-200"
              >
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                  Buy {selectedService.name}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter link or username"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                  />

                  {quantityError && (
                    <p className="text-sm text-red-500">{quantityError}</p>
                  )}

                  <div className="text-sm text-gray-300">
                    <strong className="text-yellow-400">Charge:</strong>{" "}
                    {charge ? `$${charge}` : "—"}
                  </div>

                  {responseMessage && (
                    <p
                      className={`text-sm mt-2 ${
                        responseType === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {responseMessage}
                    </p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="w-full px-4 py-2 rounded-md bg-[#0e0e0f] border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-4 py-2 rounded-md bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-semibold hover:bg-yellow-500/30 hover:border-yellow-400 transition disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
