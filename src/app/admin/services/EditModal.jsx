"use client";

import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
// ✅ Correct constant reference
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

// ✅ Import or define Modal
function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-xl w-full max-w-md p-5 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-300">
          <FaTimes size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function EditServiceModal({ editData, onSave, onClose }) {
    console.log(editData)
  const [localData, setLocalData] = useState({ ...editData }); // ✅ Prevent slow mutation
  const formRef = useRef(null);

  // ✅ Faster field update handler
  const handleChange = (key, val) => {
    setLocalData(prev => ({ ...prev, [key]: val }));
  };

  // ✅ Save optimized object
  const handleSave = () => {
    const updated = { ...localData };

    // ✅ Convert numeric fields safely
    for (const key in updated) {
      const v = updated[key];
      if (v !== "" && !isNaN(v)) {
        updated[key] = Number(v);
      }
    }

    updated.updatedAt = new Date().toISOString();
    onSave(updated);
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Edit Service">
      <form ref={formRef} className="h-[60vh] overflow-y-auto pr-2 space-y-3">

        {Object.entries(localData)
          .filter(([key]) => !["createdAt", "updatedAt", "customservice","_id",'storedBy','status'].includes(key))
          .map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">

            <label className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-200">
              {key.replace(/_/g, " ")}
            </label>

            {/* ✅ Proper category dropdown */}
            {key.toLowerCase() === "category" ? (
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E1F23] text-sm outline-none dark:text-white"
              >
                {CATEGORY_OPTIONS.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            ) : (
              <input
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E1F23] text-sm outline-none dark:text-white"
              />
            )}

          </div>
        ))}

      </form>

      {/* ✅ Sticky footer Save button */}
      <div className="pt-3 border-t dark:border-gray-700 mt-3">
        <button onClick={handleSave} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full">
          Save Changes
        </button>
      </div>

    </Modal>
  );
}
