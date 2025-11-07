"use client";

import { getServices } from "@/lib/services";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { MdReceipt, MdAccessTime } from "react-icons/md";
import { createOrderAction } from "@/lib/userActions";
export default function OrderForm() {
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");
  const [quantityError, setQuantityError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  // ✅ Fetch all services once
  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        if (data) setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    }
    fetchServices();
  }, []);

  // ✅ Extract unique categories
  useEffect(() => {
    if (services.length > 0) {
      const uniqueCats = [
        ...new Set(services.map((s) => s.category).filter(Boolean)),
      ];
      setCategories(uniqueCats);
      if (!category) setCategory(uniqueCats[0] || "");
    }
  }, [services]);

  // ✅ Debounced global search (not limited by category)
  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      const filtered = services.filter(
        (s) =>
          (!searchTerm ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.description &&
              s.description.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredServices(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, services]);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setCategoryDropdownOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Calculate charge dynamically
  useEffect(() => {
    if (service && quantity && services.length > 0) {
      const srv = services.find((s) => s.service === service);
      if (srv && srv.rate) {
        const rate = parseFloat(srv.rate.toString().replace(/,/g, ""));
        const qty = parseInt(quantity, 10);
        if (!isNaN(rate) && !isNaN(qty)) {
          const total = (rate / 1000) * qty;
          setCharge(total.toFixed(2));
        } else setCharge("");
      } else setCharge("");
    } else setCharge("");
  }, [service, quantity, services]);

  // ✅ Validate quantity
  useEffect(() => {
    if (!service || services.length === 0) return;
    const srv = services.find((s) => s.service === service);
    if (!srv) return;
    const qty = parseInt(quantity, 10);
    if (qty < srv.min) {
      setQuantityError(`Minimum allowed quantity is ${srv.min}`);
    } else if (qty > srv.max) {
      setQuantityError(`Maximum allowed quantity is ${srv.max}`);
    } else setQuantityError("");
  }, [quantity, service, services]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !link || !quantity || !charge) {
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
    setResponseMessage(null);

    try {
      const res = await createOrderAction(service,link,quantity,charge)

     
      if (!res.success) {
        setResponseMessage(`❌ ${data.error || "Failed to create order."}`);
        setResponseType("error");
      } else {
        setResponseMessage(`✅ Order created successfully! ID: ${res?.orderId}`);
        setResponseType("success");
        setService("");
        setLink("");
        setQuantity("");
        setCharge("");
        setSearchTerm("");
        setSelectedService(null);
      }
    } catch (err) {
      console.error(err);
      setResponseMessage("❌ Something went wrong while creating the order.");
      setResponseType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center sm:px-6 lg:px-8 py-8">
  <div className="w-full max-w-3xl lg:max-w-4xl bg-[#161617]/95 border border-yellow-500/20 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.12)] p-4 sm:p-6 lg:p-8 text-gray-100 backdrop-blur-md transition-all duration-300">
    
    {/* 🧾 Title */}
    <h2 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-8 tracking-wide">
      <MdReceipt size={36} className="text-yellow-500 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
      Place Your Order
    </h2>

    {/* 📝 Form */}
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-sm sm:text-base">
      
      {/* 🔍 Search */}
      <div className="relative" ref={searchRef}>
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-base" />
        <input
          type="text"
          placeholder="Search service by name or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchDropdownOpen(true);
          }}
          className="w-full pl-10 pr-3 py-3 lg:py-3.5 rounded-lg bg-[#0e0e0f] border border-yellow-500/30 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
        />

        {/* 🔽 Dropdown */}
        {searchTerm && searchDropdownOpen && (
          <div className="absolute z-20 mt-2 w-full bg-[#151517] border border-yellow-500/20 rounded-lg shadow-[0_0_12px_rgba(234,179,8,0.15)] max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-4 text-yellow-400">
                <FaSpinner className="animate-spin mr-2" /> Searching...
              </div>
            ) : filteredServices.length > 0 ? (
              <ul>
                {filteredServices.map((srv, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setSearchTerm(srv.name);
                      setSelectedService(srv);
                      setService(srv.service);
                      setCategory(srv.category || "");
                      setFilteredServices([]);
                      setSearchDropdownOpen(false);
                      setLoading(false);
                    }}
                    className="px-4 py-2 text-gray-200 hover:bg-yellow-500/20 cursor-pointer text-sm sm:text-base transition"
                  >
                    <p className="font-medium text-yellow-400">{srv.name}</p>
                    <p className="text-gray-400 text-xs truncate">{srv.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-gray-400 text-sm text-center">No results found.</div>
            )}
          </div>
        )}
      </div>

      {/* 📁 Category Dropdown */}
      <div ref={categoryRef}>
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-300">
          Category
        </label>
        <div
          className="relative"
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
        >
          <div className="w-full border border-yellow-500/30 rounded-lg p-3 lg:p-3.5 bg-[#0e0e0f] flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition text-sm sm:text-base">
            {category || "Select category"}
            <span className="ml-2 text-gray-400">▼</span>
          </div>
          {categoryDropdownOpen && categories.length > 0 && (
            <ul className="absolute z-50 w-full max-h-56 overflow-auto bg-[#161617] border border-yellow-500/30 rounded-xl mt-2 shadow-lg text-sm">
              {categories.map((cat, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setCategory(cat);
                    setCategoryDropdownOpen(false);
                  }}
                  className="p-2.5 hover:bg-yellow-500/10 cursor-pointer truncate text-gray-100 transition"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🧩 Service Dropdown */}
      <div ref={dropdownRef}>
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-300">
          Service
        </label>
        <div
          className="relative"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="w-full border border-yellow-500/30 rounded-lg p-3 lg:p-3.5 bg-[#0e0e0f] flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition text-sm sm:text-base">
            {service
              ? `${services.find((s) => s.service === service)?.service} | ${
                  services.find((s) => s.service === service)?.name
                } | ₹${services.find((s) => s.service === service)?.rate}`
              : "Select a service"}
            <span className="ml-2 text-gray-400">▼</span>
          </div>
          {dropdownOpen && filteredServices.length > 0 && (
            <ul className="absolute z-50 w-full max-h-60 overflow-auto bg-[#161617] border border-yellow-500/30 rounded-xl mt-2 shadow-lg text-sm">
              {filteredServices.map((srv) => (
                <li
                  key={srv.service}
                  onClick={() => {
                    setService(srv.service);
                    setSelectedService(srv);
                    setDropdownOpen(false);
                  }}
                  className="p-2.5 hover:bg-yellow-500/10 cursor-pointer truncate text-gray-100 transition"
                >
                  {srv.service} {srv.name} | ₹{srv.rate}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ℹ️ Dynamic Info */}
      {selectedService && (
        <div className="bg-[#0e0e0f] border border-yellow-500/30 rounded-lg p-4 lg:p-5 text-gray-300 text-sm sm:text-base shadow-[0_0_10px_rgba(255,255,0,0.05)]">
          <p className="text-yellow-400 font-semibold mb-1">
            {selectedService.service} {selectedService.name}
          </p>
          <p className="text-gray-400 mb-2">{selectedService.desc || "No description available."}</p>
          <p className="flex items-center gap-2 text-xs sm:text-sm text-yellow-500">
            <MdAccessTime />
            {selectedService.time
              ? `Avg Time: ${selectedService.average_time}`
              : "No enough data available"}
          </p>
        </div>
      )}

      {/* 🔗 Link */}
      <div>
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-300">
          Link
        </label>
        <input
          type="text"
          className="w-full border border-yellow-500/30 rounded-lg p-3 lg:p-3.5 bg-[#0e0e0f] text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter post or video link"
        />
      </div>

      {/* 🔢 Quantity */}
      <div>
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          className={`w-full rounded-lg p-3 lg:p-3.5 bg-[#0e0e0f] text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base ${
            quantityError ? "border-red-500" : "border-yellow-500/30"
          }`}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
        {quantityError && (
          <small className="text-red-400 font-medium text-xs sm:text-sm">{quantityError}</small>
        )}
      </div>

      {/* 💰 Charge */}
      <div>
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-300">
          Charge
        </label>
        <input
          type="text"
          className="w-full border border-yellow-500/30 rounded-lg p-3 lg:p-3.5 bg-[#0e0e0f] text-gray-100 text-sm sm:text-base"
          value={charge ? `₹${charge}` : ""}
          readOnly
        />
      </div>

      {/* 🚀 Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 lg:py-4 rounded-lg font-semibold hover:shadow-[0_0_18px_rgba(250,204,21,0.3)] transition-all disabled:opacity-50 text-sm sm:text-base"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            Loading...
          </span>
        ) : (
          "Place Order"
        )}
      </button>
    </form>

    {/* 🧩 Response Message */}
    {responseMessage && (
      <p
        className={`mt-5 text-center font-medium text-sm sm:text-base ${
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
