"use client";
import {
  FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaSpotify,
  FaTiktok, FaTelegramPlane, FaLinkedinIn, FaDiscord, FaGlobe
} from "react-icons/fa";
import {
  FaSearch, FaSpinner
} from "react-icons/fa";
import { MdReceipt, MdAccessTime } from "react-icons/md";

import { getServices, getCategories } from "@/lib/services";
import { createOrderAction } from "@/lib/userActions";
import QuickActions from "./QuickActions";
import { useCurrency } from "@/context/CurrencyContext";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ---------------------------------------------------------
// ICON HELPERS
// ---------------------------------------------------------
const icons = [
  { name: "Instagram", icon: <FaInstagram size={28} /> },
  { name: "Facebook", icon: <FaFacebookF size={28} /> },
  { name: "YouTube", icon: <FaYoutube size={28} /> },
  { name: "Twitter", icon: <FaTwitter size={28} /> },
  { name: "Spotify", icon: <FaSpotify size={28} /> },
  { name: "TikTok", icon: <FaTiktok size={28} /> },
  { name: "Telegram", icon: <FaTelegramPlane size={28} /> },
  { name: "LinkedIn", icon: <FaLinkedinIn size={28} /> },
  { name: "Discord", icon: <FaDiscord size={28} /> },
  { name: "Website", icon: <FaGlobe size={28} /> },
];

const getCategoryIcon = (cat) =>
  icons.find((i) => cat?.toLowerCase().includes(i.name.toLowerCase()))?.icon || <FaGlobe size={20} />;

const getPlatformIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("instagram")) return <FaInstagram className="text-pink-500 text-lg" />;
  if (lower.includes("youtube")) return <FaYoutube className="text-red-500 text-lg" />;
  if (lower.includes("facebook")) return <FaFacebookF className="text-blue-600 text-lg" />;
  if (lower.includes("tiktok")) return <FaTiktok className="text-white text-lg" />;
  if (lower.includes("telegram")) return <FaTelegramPlane className="text-sky-400 text-lg" />;
  if (lower.includes("twitter")) return <FaTwitter className="text-blue-400 text-lg" />;
  return <FaGlobe className="text-gray-500 text-lg" />;
};

// ---------------------------------------------------------

export default function OrderForm({ selectedCategory = "" }) {
  const { symbol, convert } = useCurrency();

  // MAIN DATA
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  // FORM STATE
  const [category, setCategory] = useState(selectedCategory || "");
  const [service, setService] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [quantityError, setQuantityError] = useState("");

  // UI
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // SUBMIT STATE
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");

  const dropdownRef = useRef();
  const categoryRef = useRef();
  const searchRef = useRef();

  // ---------------------------------------------------------
  // LOAD ALL DATA FIRST (CATEGORIES + SERVICES)
  // ---------------------------------------------------------
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const srvRes = await getServices();
        const catRes = await getCategories();

        const srvList = Array.isArray(srvRes?.plain)
          ? srvRes.plain
          : Array.isArray(srvRes)
          ? srvRes
          : [];

        const catList = Array.isArray(catRes?.data)
          ? catRes.data
          : [...new Set(srvList.map((s) => s.category).filter(Boolean))];

        if (!alive) return;

        setServices(srvList);
        setCategories(catList);

        // Auto-select category after everything is loaded
        let chosenCategory = selectedCategory
          ? catList.find((c) => c.toLowerCase().includes(selectedCategory.toLowerCase())) || catList[0]
          : catList[0];

        setCategory(chosenCategory);

        const filtered = srvList.filter((s) => s.category === chosenCategory);
        const firstSrv = filtered[0] || null;

        setSelectedService(firstSrv);
        setService(firstSrv?.service || "");
      } catch (e) {
        console.error(e);
      }
    }

    load();
    return () => (alive = false);
  }, [selectedCategory]);

  // ---------------------------------------------------------
  // MEMOIZED FILTERED SERVICES
  // ---------------------------------------------------------
  const filteredServices = useMemo(() => {
    if (!services.length) return [];

    const term = searchTerm.toLowerCase();

    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (!term) return true;

      return (
        s.name?.toLowerCase().includes(term) ||
        s.desc?.toLowerCase().includes(term) ||
        s.service?.toLowerCase().includes(term)
      );
    });
  }, [services, category, searchTerm]);

  // ---------------------------------------------------------
  // MEMOIZED SERVICE OBJ
  // ---------------------------------------------------------
  const activeService = useMemo(
    () => services.find((s) => s.service === service) || null,
    [services, service]
  );

  // ---------------------------------------------------------
  // QUANTITY VALIDATION + CHARGE CALCULATION
  // ---------------------------------------------------------
  useEffect(() => {
    if (!activeService || !quantity) {
      setCharge("");
      setQuantityError("");
      return;
    }

    const qty = Number(quantity);
    const min = Number(activeService.min || 0);
    const max = Number(activeService.max || Infinity);

    if (qty < min) return setQuantityError(`Minimum allowed quantity is ${min}`);
    if (qty > max) return setQuantityError(`Maximum allowed quantity is ${max}`);

    setQuantityError("");

    const base = Number(activeService.rate || 0);
    const profit = Number(activeService.profitPercentage || activeService.Profitpercentage || 0);
    const finalRate = base * (1 + profit / 100);

    const total = (finalRate / 1000) * qty;

    setCharge(total.toFixed(2));
  }, [quantity, activeService]);

  // ---------------------------------------------------------
  // CLICK OUTSIDE CLOSE DROPDOWNS
  // ---------------------------------------------------------
  useEffect(() => {
    function close(e) {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
      if (!categoryRef.current?.contains(e.target)) setCategoryDropdownOpen(false);
      if (!searchRef.current?.contains(e.target)) setSearchDropdownOpen(false);
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ---------------------------------------------------------
  // SELECT SERVICE HANDLER (MEMOIZED)
  // ---------------------------------------------------------
  const handleServiceSelect = useCallback((srv) => {
    setSelectedService(srv);
    setService(srv.service);
    setDropdownOpen(false);
  }, []);

  // ---------------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service || !link || !quantity || !charge) {
      setResponseMessage("⚠️ Please fill all fields.");
      setResponseType("error");
      return;
    }

    if (quantityError) {
      setResponseMessage(quantityError);
      setResponseType("error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createOrderAction(service, link, quantity, charge);

      if (!res.success) {
        setResponseType("error");
        setResponseMessage(
          res.message === "Insufficient balance."
            ? "Insufficient balance. Please Add Fund In Your Account"
            : res.message
        );
      } else {
        setResponseType("success");
        setResponseMessage(`✅ Order created successfully (ID: ${res.orderId})`);

        setService("");
        setLink("");
        setQuantity("");
        setCharge("");
        setSearchTerm("");
      }
    } catch (err) {
      setResponseType("error");
      setResponseMessage("❌ Something went wrong.");
    }

    setSubmitting(false);
  };

  // ---------------------------------------------------------
  // JSX (UNCHANGED UI)
  // ---------------------------------------------------------
  return (
    <div className="w-full flex-1 flex justify-start bg-gray-100 dark:bg-[#0F1117]">
      <div className="w-full max-w-4xl mx-auto bg-gray-50 dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] rounded-2xl shadow-lg py-6 sm:p-8 px-4">

        <h2 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold mb-8">
          <MdReceipt size={38} /> Place Order
        </h2>

        <QuickActions />

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* SEARCH */}
          <div className="relative" ref={searchRef}>
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchDropdownOpen(true);
              }}
              placeholder="Search service..."
              className="w-full pl-10 pr-3 py-2 rounded-lg"
            />

            {searchTerm && searchDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-full max-h-64 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg z-[99999] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <FaSpinner className="animate-spin" /> Searching...
                  </div>
                ) : filteredServices.length ? (
                  filteredServices.map((srv, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchTerm(srv.name);
                        handleServiceSelect(srv);
                        setCategory(srv.category);
                        setSearchDropdownOpen(false);
                      }}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                    >
                      <p className="font-semibold">{srv.name}</p>
                      <p className="text-sm opacity-75">{srv.desc}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-center opacity-70">No results found.</p>
                )}
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div className="relative" ref={categoryRef}>
            <label>Category</label>
            <div
              onClick={() => setCategoryDropdownOpen((p) => !p)}
              className="bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            >
              {category ? getCategoryIcon(category) : <FaGlobe />}
              <span>{category || "Select category"}</span>
            </div>

            {categoryDropdownOpen && (
              <ul className="absolute left-0 top-full mt-2 w-full max-h-56 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg shadow-lg overflow-y-auto">
                {categories.map((cat, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setCategory(cat);
                      setCategoryDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICE */}
          <div className="relative" ref={dropdownRef}>
            <label>Service</label>
            <div
              onClick={() => setDropdownOpen((p) => !p)}
              className="bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            >
              {selectedService ? (
                <>
                  {getPlatformIcon(selectedService.name)}
                  <span>
                    {selectedService.service} | {selectedService.name} |{" "}
                    {symbol}
                    {(
                      convert(
                        Number(selectedService.rate || 0) *
                          (1 +
                            Number(selectedService.profitPercentage || selectedService.Profitpercentage || 0) /
                              100
                          )
                      )
                    ).toFixed(2)}
                  </span>
                </>
              ) : (
                "Select a service"
              )}
            </div>

            {dropdownOpen && filteredServices.length > 0 && (
              <ul className="absolute left-0 top-full mt-2 w-full max-h-56 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg overflow-y-auto z-[99999]">
                {filteredServices.map((srv, i) => (
                  <li
                    key={i}
                    onClick={() => handleServiceSelect(srv)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  >
                    {getPlatformIcon(srv.name)}
                    <span>
                      {srv.service} — {srv.name} —{" "}
                      {(
                        convert(
                          Number(srv.rate || 0) *
                            (1 +
                              Number(srv.profitPercentage || srv.Profitpercentage || 0) /
                                100
                            )
                        )
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICE INFO */}
          {selectedService && (
            <div className="border p-4 rounded-lg">
              <p className="text-sm opacity-75">{selectedService.desc || "No description available"}</p>
              <p className="flex items-center gap-2 mt-2 opacity-80">
                <MdAccessTime />
                {selectedService.average_time || "No data available"}
              </p>
            </div>
          )}

          {/* LINK */}
          <div>
            <label>Link</label>
            <input
              className="w-full bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg"
              placeholder="Enter post or video link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label>Quantity</label>
            <input
              type="number"
              className={`w-full px-3 py-2 rounded-lg ${
                quantityError ? "border-red-500" : "border"
              }`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
            {quantityError && <p className="text-red-400 text-sm">{quantityError}</p>}
          </div>

          {/* CHARGE */}
          <div>
            <label>Charge</label>
            <input
              readOnly
              className="w-full bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg"
              value={charge ? `${symbol}${charge}` : ""}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-gray-800 text-white"
          >
            {submitting ? "Processing..." : "Place Order"}
          </button>
        </form>

        {responseMessage && (
          <p
            className={`mt-4 text-center ${
              responseType === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}
