"use client";

import { useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaSpotify,
  FaTiktok,
  FaTelegram,
  FaLinkedin,
  FaDiscord,
  FaGlobe,
  FaStar,
  FaInfinity,
} from "react-icons/fa";

const categories = [
  { icon: <FaInstagram />, label: "Instagram", key: "instagram" },
  { icon: <FaFacebook />, label: "Facebook", key: "facebook" },
  { icon: <FaYoutube />, label: "Youtube", key: "youtube" },
  { icon: <FaTwitter />, label: "Twitter", key: "twitter" },
  { icon: <FaSpotify />, label: "Spotify", key: "spotify" },
  { icon: <FaTiktok />, label: "Tiktok", key: "tiktok" },
  { icon: <FaTelegram />, label: "Telegram", key: "telegram" },
  { icon: <FaLinkedin />, label: "Linkedin", key: "linkedin" },
  { icon: <FaDiscord />, label: "Discord", key: "discord" },
  { icon: <FaGlobe />, label: "Website Traffic", key: "traffic" },
  { icon: <FaStar />, label: "Others", key: "other", isOther: true },
  { icon: <FaInfinity />, label: "Everything", key: "everything" },
];

export default function CategoryFilter() {
  const [active, setActive] = useState(null);

  const handleFilter = (key, isOther = false) => {
    setActive(key);
    console.log(isOther ? "Filter Others" : "Filter:", key);
  };

  return (
    <div className="w-full bg-gray-200 rounded-3xl shadow-lg">

      <div className="flex flex-wrap px-3 gap-2">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => handleFilter(cat.key, cat.isOther)}
            className={`flex items-center gap-3 w-55 px-3 py-1 rounded-2xl text-white shadow-lg transition-all duration-300
              ${
                active === cat.key
                  ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl scale-105"
                  : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl"
              }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="font-medium text-lg">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
