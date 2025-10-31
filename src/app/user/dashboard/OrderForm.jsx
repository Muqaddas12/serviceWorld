"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch, FaGlobe } from "react-icons/fa";

export default function OrderForm({ services: initialServices = [] }) {
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [services, setServices] = useState(initialServices);
  const [filteredServices, setFilteredServices] = useState(initialServices);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");
  const [quantityError, setQuantityError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const dropdownRefe = useRef(null);

  const currencyRates = {
    INR: { symbol: "₹", rate: 1 },
    USD: { symbol: "$", rate: 0.012 },
    EUR: { symbol: "€", rate: 0.011 },
    GBP: { symbol: "£", rate: 0.0097 },
    PKR: { symbol: "₨", rate: 3.35 },
  };
  const selectedCurrency = currencyRates[currency];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRefe.current && !dropdownRefe.current.contains(e.target)) setCurrencyDropdownOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryDropdownOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const uniqueCats = [...new Set(services.map((s) => s.category).filter(Boolean))];
      setCategories(uniqueCats);
      if (!category) setCategory(uniqueCats[0] || "");
    }
  }, [services]);

  useEffect(() => {
    const filtered = services.filter(
      (s) =>
        (!category || s.category === category) &&
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [category, searchTerm, services]);

  useEffect(() => {
    if (service && quantity && services.length > 0) {
      const selectedService = services.find((s) => s.service === service);
      if (selectedService && selectedService.rate) {
        const rate = parseFloat(selectedService.rate.toString().replace(/,/g, ""));
        const qty = parseInt(quantity, 10);
        if (!isNaN(rate) && !isNaN(qty)) {
          const total = rate * qty * selectedCurrency.rate;
          setCharge(total.toFixed(2));
        } else setCharge("");
      } else setCharge("");
    } else setCharge("");
  }, [service, quantity, services, currency]);

  useEffect(() => {
    if (!service || services.length === 0) return;
    const selectedService = services.find((s) => s.service === service);
    if (!selectedService) return;
    const qty = parseInt(quantity, 10);
    if (qty < selectedService.min) {
      setQuantityError(`Minimum allowed quantity is ${selectedService.min}`);
    } else if (qty > selectedService.max) {
      setQuantityError(`Maximum allowed quantity is ${selectedService.max}`);
    } else setQuantityError("");
  }, [quantity, service, services]);

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
      const res = await fetch("/api/orders/createorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, link, quantity, charge, currency }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setResponseMessage(`❌ ${data.error || "Failed to create order."}`);
        setResponseType("error");
      } else {
        setResponseMessage(`✅ Order created successfully! ID: ${data.orderId}`);
        setResponseType("success");
        setService("");
        setLink("");
        setQuantity("");
        setCharge("");
      }
    } catch (err) {
      console.error(err);
      setResponseMessage("❌ Something went wrong while creating the order.");
      setResponseType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = service ? services.find((s) => s.service === service) : null;
  const invalidServiceData =
    !selectedService ||
    !selectedService.name ||
    !selectedService.rate ||
    selectedService.min == null ||
    selectedService.max == null;

  return (
    <div className="w-full min-h-screen bg-[#0b0b0d] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-[#161617]/95 border border-yellow-500/20 rounded-2xl shadow-[0_0_15px_rgba(250,204,21,0.15)] p-6 sm:p-8 text-gray-100">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-center mb-8">
          🧾 Place Your Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🔍 Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" />
            <input
              type="text"
              placeholder="Search service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 rounded-xl p-3 bg-[#0e0e0f] border border-yellow-500/30 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* 🌍 Currency */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1" ref={dropdownRefe}>
              <label className="block mb-2 text-sm font-semibold text-gray-300">Currency</label>
              <div className="relative" onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}>
                <div className="w-full border border-yellow-500/30 rounded-xl p-3 bg-[#0e0e0f] flex justify-between items-center cursor-pointer hover:border-yellow-500/50">
                  <FaGlobe className="text-yellow-500" />
                  <span className="font-medium">{currency}</span>
                  <span className="ml-2 text-gray-400">▼</span>
                </div>
                {currencyDropdownOpen && (
                  <ul className="absolute z-50 w-full max-h-56 overflow-auto bg-[#161617] border border-yellow-500/30 rounded-xl mt-2 shadow-lg">
                    {Object.keys(currencyRates).map((code) => (
                      <li
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className="p-2.5 hover:bg-yellow-500/10 cursor-pointer text-gray-100 flex items-center gap-2"
                      >
                        <FaGlobe className="text-yellow-500" />
                        <span>{code}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 📁 Category */}
          <div ref={categoryRef}>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Category</label>
            <div className="relative" onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
              <div className="w-full border border-yellow-500/30 rounded-xl p-3 bg-[#0e0e0f] flex justify-between items-center cursor-pointer hover:border-yellow-500/50">
                {category || "Select category"}
                <span className="ml-2 text-gray-400">▼</span>
              </div>
              {categoryDropdownOpen && categories.length > 0 && (
                <ul className="absolute z-50 w-full max-h-56 overflow-auto bg-[#161617] border border-yellow-500/30 rounded-xl mt-2 shadow-lg">
                  {categories.map((cat, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className="p-2.5 hover:bg-yellow-500/10 cursor-pointer truncate text-gray-100"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 🧩 Service */}
          <div ref={dropdownRef}>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Service</label>
            <div className="relative" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-full border border-yellow-500/30 rounded-xl p-3 bg-[#0e0e0f] flex justify-between items-center cursor-pointer hover:border-yellow-500/50">
                {service
                  ? `${services.find((s) => s.service === service)?.name} | ${selectedCurrency.symbol}${services.find((s) => s.service === service)?.rate}`
                  : "Select a service"}
                <span className="ml-2 text-gray-400">▼</span>
              </div>
              {dropdownOpen && filteredServices.length > 0 && (
                <ul className="absolute z-50 w-full max-h-60 overflow-auto bg-[#161617] border border-yellow-500/30 rounded-xl mt-2 shadow-lg">
                  {filteredServices.map((srv) => (
                    <li
                      key={srv.service}
                      onClick={() => {
                        setService(srv.service);
                        setDropdownOpen(false);
                      }}
                      className="p-2.5 hover:bg-yellow-500/10 cursor-pointer truncate text-gray-100"
                    >
                      {srv.name} | {selectedCurrency.symbol}
                      {(srv.rate * selectedCurrency.rate).toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 🔗 Link */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Link</label>
            <input
              type="text"
              className="w-full border border-yellow-500/30 rounded-xl p-3 bg-[#0e0e0f] text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter post or video link"
            />
          </div>

          {/* 🔢 Quantity */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Quantity</label>
            <input
              type="number"
              className={`w-full rounded-xl p-3 bg-[#0e0e0f] text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 ${
                quantityError ? "border-red-500" : "border-yellow-500/30"
              }`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
            {quantityError && <small className="text-red-400 font-medium text-sm">{quantityError}</small>}
          </div>

          {/* 💰 Charge */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Charge</label>
            <input
              type="text"
              className="w-full border border-yellow-500/30 rounded-xl p-3 bg-[#0e0e0f] text-gray-100"
              value={charge ? `${selectedCurrency.symbol}${charge}` : ""}
              readOnly
            />
          </div>

          {/* 🚀 Submit */}
          <button
            type="submit"
            disabled={submitting || invalidServiceData}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3.5 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              "Place Order"
            )}
          </button>
        </form>

        {responseMessage && (
          <p
            className={`mt-5 text-center font-medium ${
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
