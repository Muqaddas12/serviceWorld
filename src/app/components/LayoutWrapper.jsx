"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Header";
import Footer from "./Footer";
import { FaWhatsapp } from "react-icons/fa";

export default function LayoutWrapper({ children, logo, siteName }) {

  const pathname = usePathname();
 

  // hide on /user/* and /admin/*
  const hide =
    pathname.startsWith("/user") || pathname.startsWith("/admin");


   const openWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?phone=917489174685&text=Hello%20InstantSMMBoost`, "_blank");
  };
  return (
    <div className="relative">
      {!hide && <Navbar logo={logo} siteName={siteName} />}
      {children}
      <button
        onClick={openWhatsApp}
        className="
          px-3 py-3 text-sm
          sm:px-4 sm:py-4 sm:text-base
          lg:px-4 lg:py-4 lg:text-lg
          rounded-full font-semibold fixed bottom-5 right-5 z-51
          bg-green-500/30 hover:bg-green-500/50
          text-green-700 dark:text-green-400
          dark:bg-green-500/40 dark:hover:bg-green-500/20
          backdrop-blur transition shadow-sm whitespace-nowrap
          disabled:opacity-50
        "
      >
        <FaWhatsapp className="text-lg sm:text-xl lg:text-2xl" />
      </button>
      {!hide && <Footer siteName={siteName} />}
    </div>
  );
}
