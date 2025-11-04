"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTwitter,
  FaSpotify,
  FaTiktok,
  FaTelegramPlane,
  FaLinkedinIn,
  FaDiscord,
  FaGlobe,
  FaStar,
  FaCircle,
  FaSearch,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

const icons = [
  { name: "Instagram", icon: <FaInstagram size={24} /> },
  { name: "Facebook", icon: <FaFacebookF size={24} /> },
  { name: "YouTube", icon: <FaYoutube size={24} /> },
  { name: "Twitter", icon: <FaTwitter size={24} /> },
  { name: "Spotify", icon: <FaSpotify size={24} /> },
  { name: "TikTok", icon: <FaTiktok size={24} /> },
  { name: "Telegram", icon: <FaTelegramPlane size={24} /> },
  { name: "LinkedIn", icon: <FaLinkedinIn size={24} /> },
  { name: "Discord", icon: <FaDiscord size={24} /> },
  { name: "Website", icon: <FaGlobe size={24} /> },
  { name: "Explore", icon: <FaStar size={24} /> },
  { name: "Network", icon: <FaCircle size={24} /> },
];

export default function ServicesPage({ services }) {
  const [search, setSearch] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  // 🧠 Filter Services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name?.toLowerCase().includes(search.toLowerCase()) ||
        srv.desc?.toLowerCase().includes(search.toLowerCase()) ||
        srv.service?.toString().includes(search);

      const matchesCategory = selectedCategory
        ? srv.category?.toLowerCase().includes(selectedCategory.toLowerCase())
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, services]);

  // ✨ Extract all categories
  const allCategories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  // 🧩 Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 px-4 sm:px-6 lg:px-12 py-10">
      {/* ======= SEARCH + CATEGORY BAR ======= */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 🔍 Custom Search Bar */}
        <div className="relative w-full sm:w-1/2" ref={searchRef}>
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            placeholder="Search service by name, description, or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearchDropdown(true);
            }}
            className="w-full bg-[#151517] border border-yellow-500/20 text-gray-100 rounded-xl py-2.5 pl-9 pr-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          {/* 🔽 Custom Dropdown */}
          {showSearchDropdown && search && (
            <div className="absolute z-50 w-full bg-[#151517] border border-yellow-500/20 rounded-xl mt-2 shadow-lg max-h-64 overflow-y-auto">
              {filteredServices.length > 0 ? (
                filteredServices.slice(0, 10).map((srv, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSearch(srv.name);
                      setShowSearchDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-yellow-500/20 cursor-pointer text-sm border-b border-yellow-500/10 last:border-none"
                  >
                    <p className="text-yellow-400 font-medium">{srv.name}</p>
                    <p className="text-gray-400 text-xs truncate">
                      ID: {srv.service} — {srv.category || "Uncategorized"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-400 text-sm text-center">
                  No results found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🧭 Custom Category Dropdown */}
        <div className="relative w-full sm:w-1/3" ref={categoryRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full bg-[#151517] border border-yellow-500/20 rounded-xl py-2.5 px-3 text-sm sm:text-base text-left flex justify-between items-center focus:ring-2 focus:ring-yellow-500"
          >
            {selectedCategory || "Select Category"}
            <FaChevronDown
              className={`ml-2 transition-transform duration-300 ${
                showCategoryDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCategoryDropdown && (
            <div className="absolute z-50 w-full bg-[#151517] border border-yellow-500/20 rounded-xl mt-2 shadow-lg max-h-64 overflow-y-auto">
              <div
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategoryDropdown(false);
                }}
                className="px-4 py-2 hover:bg-yellow-500/20 cursor-pointer text-sm border-b border-yellow-500/10"
              >
                All Categories
              </div>
              {allCategories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className={`px-4 py-2 hover:bg-yellow-500/20 cursor-pointer text-sm border-b border-yellow-500/10 last:border-none ${
                    selectedCategory === cat ? "bg-yellow-500/10" : ""
                  }`}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======= CATEGORY ICON FILTER ======= */}
      <div className="flex items-center justify-center mb-8">
        <div
          className="
            grid 
            grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 
            gap-3 w-full max-w-6xl py-4
          "
        >
          {icons.map((item, i) => (
            <div
              key={i}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === item.name ? null : item.name
                )
              }
              className={`bg-[#151517] border flex flex-col items-center justify-center rounded-2xl py-3 cursor-pointer transition-all duration-300 ${
                selectedCategory === item.name
                  ? "border-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.25)] scale-105"
                  : "border-yellow-500/20 hover:scale-105 hover:shadow-[0_0_18px_rgba(234,179,8,0.25)]"
              }`}
            >
              <span className="text-yellow-400 mb-1">{item.icon}</span>
              <span className="text-gray-300 text-sm mt-2 font-medium hidden md:block text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ======= SERVICE CARDS ======= */}
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        {filteredServices.length > 0 ? (
          filteredServices.map((srv, index) => {
            const minTotal = parseFloat(srv.rate) * parseFloat(srv.min);
            return (
              <div
                key={index}
                className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:scale-[1.01] transition-all duration-300"
              >
                {/* LEFT SIDE */}
                <div className="flex-1 pr-4">
                  <h2 className="text-lg font-semibold text-yellow-400 leading-tight mb-1 flex items-center gap-2">
                    <span className="text-gray-400 text-xs">#{srv.service}</span>
                    {srv.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">
                    {srv.desc || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
                    <p>
                      <span className="font-medium text-gray-300">Type:</span>{" "}
                      {srv.type || "Default"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">Category:</span>{" "}
                      {srv.category || "Uncategorized"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">Min:</span>{" "}
                      {srv.min} | <span className="font-medium">Max:</span>{" "}
                      {srv.max}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="mt-4 md:mt-0 flex flex-col md:items-end md:w-1/4 border-t md:border-t-0 md:border-l border-yellow-500/20 md:pl-6 pt-3 md:pt-0">
                  <p className="text-yellow-400 font-semibold text-base mb-2">
                    ₹{minTotal.toLocaleString("en-IN")}{" "}
                    <span className="text-sm text-gray-400">/ start</span>
                  </p>
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="px-5 py-2 rounded-lg bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 font-semibold text-sm hover:bg-yellow-500/30 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all duration-300"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-400">
            No services found.
          </div>
        )}
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

            <h2 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <span className="text-gray-400 text-sm">#{selectedService.service}</span>
              {selectedService.name}
            </h2>

            <p className="text-gray-400 mb-4">
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
                <span className="font-medium text-yellow-400">Min Quantity:</span>{" "}
                {selectedService.min}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Max Quantity:</span>{" "}
                {selectedService.max}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Rate (per unit):</span>{" "}
                ₹{parseFloat(selectedService.rate).toLocaleString("en-IN")}
              </p>
              <p>
                <span className="font-medium text-yellow-400">Starting From:</span>{" "}
                ₹
                {(
                  parseFloat(selectedService.rate) *
                  parseFloat(selectedService.min)
                ).toLocaleString("en-IN")}{" "}
                <span className="text-gray-400">
                  (for {selectedService.min} units)
                </span>
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
