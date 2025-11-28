"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { updateSocialMediaLinksAction, getSocialMediaLinksAction } from "@/lib/adminServices";

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "Telegram",
  "Whatsapp",
  "YouTube",
 
];

export default function SocialMediaLinks() {
  const router = useRouter();
  const [links, setLinks] = useState({});
  const [status, setStatus] = useState(null);

  // ✅ Load saved links when page opens
  useEffect(() => {
    const fetchLinks = async () => {
      const res = await getSocialMediaLinksAction();
      if (res.status && res.links) {
        setLinks(res.links);
      }
    };
    fetchLinks();
  }, []);

  // ✅ Store keys in lowercase for DB
  const handleChange = (platform, value) => {
    const key = platform.toLowerCase();
    setLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setStatus({ type: "loading", message: "Saving links..." });

      const res = await updateSocialMediaLinksAction({ links });

      if (res.status) {
        setStatus({ type: "success", message: res.message });
      } else {
        setStatus({ type: "error", message: res.message });
      }

      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: "error", message: "Unexpected error saving links" });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[900px] mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-300">
          ←
        </button>
        <h1 className="text-2xl font-semibold">Social Media Links</h1>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-[#151517] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Add or update the social media links that appear on your website.
        </p>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SOCIAL_PLATFORMS.map((platform) => {
            const key = platform.toLowerCase();
            return (
              <div key={platform} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {platform}
                </label>
                <input
                  type="url"
                  placeholder={`Enter ${platform} URL`}
                  value={links[key] || ""}
                  onChange={(e) => handleChange(platform, e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0F1117] outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition"
                />
              </div>
            );
          })}
        </div>

        {/* Status Box */}
        {status && (
          <div
            className={`mt-6 text-sm text-center font-medium p-3 rounded-xl ${
              status.type === "success"
                ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20"
                : status.type === "error"
                ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
                : "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700/30"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded-2xl shadow transition hover:opacity-80"
          >
            <Save size={16} /> Save Links
          </button>
        </div>
      </div>
    </motion.div>
  );
}
