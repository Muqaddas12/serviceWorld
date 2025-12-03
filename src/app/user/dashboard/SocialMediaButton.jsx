"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { getSocialMediaLinksForUserAction } from "@/lib/adminServices";

export default function SocialButtons({ close }) {
  const [links, setLinks] = useState({
    whatsapp: "",
    telegram: "",
  });
  const [loading, setLoading] = useState(true);

  // ==================== Load Links from Server Action ====================
  useEffect(() => {
    const loadLinks = async () => {
      const res = await getSocialMediaLinksForUserAction();


      if (res.status && res.links) {
    
        setLinks({
          whatsapp: res.links[0].whatsapp || "",
          telegram: res.links[0].telegram || "",
        });
      }

      setLoading(false);
    };

    loadLinks();
  }, []);

  // ==================== Button Handlers ====================
  const openWhatsApp = () => {
    if (!links.whatsapp) return alert("WhatsApp number is missing");
    window.open(`https://wa.me/${links.whatsapp}`, "_blank");
  };

  const openTelegram = () => {
    if (!links.telegram) return alert("Telegram username is missing");
    window.open(`https://t.me/${links.telegram}`, "_blank");
  };

  if (loading) {
    return (
      <span className="text-yellow-400 text-sm">Loading social links...</span>
    );
  }

  return (
    <div className="flex flex-row items-center gap-3 sm:gap-4">
      {/* ========== WhatsApp Button ========== */}
      <button
        onClick={openWhatsApp}
        disabled={!links.whatsapp}
        className="
          flex items-center gap-2 sm:gap-3
          px-4 py-3 text-sm min-w-[140px]
          sm:px-5 sm:py-3 sm:text-base
          lg:px-6 lg:py-4 lg:text-lg
          rounded-xl font-semibold
          bg-green-500/20 hover:bg-green-500/30
          text-green-600 dark:text-green-400
          dark:bg-green-500/10 dark:hover:bg-green-500/20
          backdrop-blur transition shadow-sm whitespace-nowrap
          disabled:opacity-50
        "
      >
        <FaWhatsapp className="text-lg sm:text-xl lg:text-2xl" />
        <span>Join WhatsApp</span>
      </button>

      {/* ========== Telegram Button ========== */}
      <button
        onClick={openTelegram}
        disabled={!links.telegram}
        className="
          flex items-center gap-2 sm:gap-3
          px-4 py-3 text-sm min-w-[140px]
          sm:px-5 sm:py-3 sm:text-base
          lg:px-6 lg:py-4 lg:text-lg
          rounded-xl font-semibold
          bg-blue-500/20 hover:bg-blue-500/30
          text-blue-600 dark:text-blue-400
          dark:bg-blue-500/10 dark:hover:bg-blue-500/20
          backdrop-blur transition shadow-sm whitespace-nowrap
          disabled:opacity-50
        "
      >
        <FaTelegramPlane className="text-lg sm:text-xl lg:text-2xl" />
        <span>Join Telegram</span>
      </button>
    </div>
  );
}
