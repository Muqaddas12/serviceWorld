"use client";

import { useState, useEffect } from "react";
import { getProvidersAction } from "@/lib/providerActions";
import { AddNewServiceAction } from "@/lib/customservices";
import { useCurrency } from "@/context/CurrencyContext";

// Icons
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
} from "react-icons/fa";

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
  { name: "Explore", icon: <FaStar size={28} /> },
  { name: "Network", icon: <FaCircle size={28} /> },
];

export default function AddNewService() {
  const { symbol, convert } = useCurrency();

  const [providers, setProviders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [serviceType, setServiceType] = useState("service");
  const [refill, setRefill] = useState("on");
  const [cancelAllowed, setCancelAllowed] = useState("on");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [price, setPrice] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [status, setStatus] = useState("enabled");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProvidersAction();
      setProviders(res || []);
      if (res.length > 0) setSelectedProvider(String(res[0].id));
    };
    loadProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId || !serviceName || !selectedProvider || !price) {
      showMessage("error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: Number(serviceId),
        name: serviceName,
        description: desc,
        category,
        type: serviceType,
        refill: refill === "on",
        cancelAllowed: cancelAllowed === "on",
        provider: Number(selectedProvider),
        price: Number(price),
        min: min ? Number(min) : null,
        max: max ? Number(max) : null,
        status,
      };

      const res = await AddNewServiceAction(payload);

      if (!res?.status) {
        showMessage("error", res.message || "Failed to add service.");
      } else {
        showMessage("success", "Service added successfully.");
        resetForm();
        setShowPopup(false);
      }
    } catch {
      showMessage("error", "Internal error.");
    }

    setLoading(false);
  };

  function resetForm() {
    setServiceId("");
    setServiceName("");
    setDesc("");
    setCategory("");
    setServiceType("service");
    setRefill("on");
    setCancelAllowed("on");
    setPrice("");
    setMin("");
    setMax("");
    setStatus("enabled");
  }

  return (
    <div className="p-4 mx-auto">
      {/* Message Banner */}
      {message && (
        <div
          className={`mb-4 p-3 rounded text-white ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Open Popup Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700"
      >
        Add New Service
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-2 z-50">
          <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-xl shadow-xl border dark:border-gray-700 p-4 max-h-[90vh] overflow-y-auto animate-fadeIn">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Add New Service
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input label="Service ID *" value={serviceId} onChange={setServiceId} />
              <Input label="Service Name *" value={serviceName} onChange={setServiceName} />

              <TextareaField
                label="Description"
                value={desc}
                onChange={setDesc}
                placeholder="Enter service description..."
              />

              {/* Category + Service Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={category}
                  onChange={setCategory}
                  options={icons.map((i) => ({
                    value: i.name,
                    label: i.name,
                  }))}
                />

                <Select
                  label="Service Type"
                  value={serviceType}
                  onChange={setServiceType}
                  options={[
                    { value: "service", label: "Service" },
                    { value: "package", label: "Package" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>

              {/* Provider */}
              <Select
                label="Provider *"
                value={selectedProvider}
                onChange={setSelectedProvider}
                options={providers.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              />

              {/* Refill + Cancel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Refill"
                  value={refill}
                  onChange={setRefill}
                  options={[
                    { value: "on", label: "On" },
                    { value: "off", label: "Off" },
                  ]}
                />

                <Select
                  label="Cancel Allowed"
                  value={cancelAllowed}
                  onChange={setCancelAllowed}
                  options={[
                    { value: "on", label: "On" },
                    { value: "off", label: "Off" },
                  ]}
                />
              </div>

              <Input label="Price *" type="number" value={price} onChange={setPrice} />

              {/* Min – Max */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Min" type="number" value={min} onChange={setMin} />
                <Input label="Max" type="number" value={max} onChange={setMax} />
              </div>

              <Select
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "enabled", label: "Enabled" },
                  { value: "disabled", label: "Disabled" },
                ]}
              />

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* -------------------- REUSABLE INPUTS -------------------- */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg min-h-[100px] resize-y bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
      />
    </div>
  );
}
