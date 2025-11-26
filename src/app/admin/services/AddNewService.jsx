"use client";

import { useState, useEffect } from "react";
import { getProvidersAction } from "@/lib/providerActions";
import { AddNewServiceAction } from "@/lib/customservices";
import { useCurrency } from "@/context/CurrencyContext";

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


// 🔹 Your category list
const CATEGORY_OPTIONS = [
  "Instagram Shares",
  "Instagram : Comments [ RANDOM ]",
  "Youtube video Views ",
  "Youtube : Comments",
  "Facebook Group Members",
  "facebook Likes",
  "Facebook Profile Followers",
  "Random Gmail buy ❤️",
  "🐥Twitter Tweet Views",
  "Telegram : Post Reaction + Views",
  "Telegram Story Services 🤳",
  "Telegram Shares",
  "Telegram Member [Male/Female]",
  "🐥Twitter Poll Votes 🗳",
  "🐥X - Twitter Views Live",
  "Website Traffic + Refferrer",
  "Website Traffic - SEO FRIENDLY- [Targeted]",
  "Website Traffic from India [+ Choose Referrer]🇮🇳",
  "instagram Reel Views 👀",
  "Telegram Member's [Indian 🇮🇳]",
  " Telegram Members [Low Quality]",
  "Telegram Post Views One-Click Done",
  "Telegram Views [ Future Post ]",
  "YouTube Likes",
  "WhatsApp Channel Members [ Fast ]🆕",
  "Instagram Reach + Impression/Post Shares",
  "Instagram [ DM Services ]",
  "Instagram live Video views [ NoN~Drop ] ",
  "Instagram Poll Votes [ Working ]",
  "Instagram Post Save [ Indian ] ",
  "Instagram Post Shares [ Indian ]",
  "YouTube Likes ( One Click Done )",
  "Facebook Story Views ( One Click Done )",
  "Facebook Reels/Video Views [ Non-Drop ]",
  "Facebook Story Reactions ( One Click Done )",
  "Facebook Post Likes ( One Click Done )",
  "Facebook Post Reactions [ ULTRA FAST ]",
  "Facebook Post Reactions [ Working Update ]",
  "𝐈𝐆 𝐅𝐎𝐋𝐋𝐎𝐖𝐄𝐑𝐒 𝐂𝐇𝐄𝐀𝐏𝐄𝐒𝐓 ",
  "𝗜𝗚 𝗥𝗲𝗲𝗹𝘀 𝗩𝗶𝗲𝘄𝘀 [ 𝗖𝗵𝗲𝗮𝗽 ] ",
  "instagram likes [ Non Drop ]",
  "Facebook",
];

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((c) => {
  const match = icons.find((i) =>
    c.toLowerCase().includes(i.name.toLowerCase())
  );

  return {
    value: c,
    label: c,
    icon: match ? match.icon : <FaCircle size={20} />,
  };
});


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
      if (res?.length > 0) setSelectedProvider(String(res[0].name));
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
        desc: desc,
        category,
        type: serviceType,
        refill: refill === "on",
        cancelAllowed: cancelAllowed === "on",
        provider: selectedProvider,
        rate: Number(price),
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
  className="px-2 py-2 bg-gray-800 text-white text-sm rounded-lg shadow hover:bg-gray-700"
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
   <CustomSelectWithIcons
  label="Category"
  value={
    CATEGORY_SELECT_OPTIONS.find((o) => o.value === category) || {
      label: "Select Category",
      icon: <FaCircle size={20} />,
    }
  }
  onChange={(opt) => setCategory(opt.value)}
  options={CATEGORY_SELECT_OPTIONS}
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
                  value: p.name,
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
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
function CustomSelectWithIcons({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border 
        border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200
        flex justify-between items-center cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {value?.icon}
          {value?.label || "Select Category"}
        </span>
        <span className="text-gray-500">▼</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg 
          bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg"
        >
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {opt.icon}
              <span className="text-gray-700 dark:text-gray-200">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
