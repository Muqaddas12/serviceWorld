"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCogs, FaCode, FaBlog } from "react-icons/fa";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ logo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="
      sticky top-0 left-0 right-0 z-50 
      bg-[#ffffff]/90 dark:bg-[#0D121A]/90
      backdrop-blur-md shadow-lg 
      border-b border-[#E5E7EB] dark:border-[#1F2633]
      transition-all duration-300
    ">
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SMM World Panel Logo"
            className="h-14 sm:h-16 w-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 
          text-[#1A1A1A] dark:text-[#F1F5F9] font-medium">
          
          <li>
            <Link href="/services" 
              className="flex items-center hover:text-[#4A6CF7] dark:hover:text-[#4A6CF7] transition-colors">
              <FaCogs className="text-[#4A6CF7] mr-2 text-[18px]" />
              Services
            </Link>
          </li>

          <li>
            <Link href="/apiv2" 
              className="flex items-center hover:text-[#4A6CF7] dark:hover:text-[#4A6CF7] transition-colors">
              <FaCode className="text-[#4A6CF7] mr-2 text-[18px]" />
              API
            </Link>
          </li>

          <li>
            <Link href="/blogs" 
              className="flex items-center hover:text-[#4A6CF7] dark:hover:text-[#4A6CF7] transition-colors">
              <FaBlog className="text-[#4A6CF7] mr-2 text-[18px]" />
              Blogs
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeSwitcher />

          <Link
            href="/auth/login"
            className="
              px-5 py-2 rounded-full font-semibold shadow-md 
              bg-[#4A6CF7] hover:bg-[#3f5ed8]
              text-white transition hover:scale-[1.03]
            "
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="
              px-5 py-2 rounded-full font-semibold shadow-md 
              bg-[#16D1A5] hover:bg-[#12b68f]
              text-white transition hover:scale-[1.03]
            "
          >
            Signup
          </Link>
        </div>
<div className="flex ">
  
<div className="mr-3 md:hidden">
  <ThemeSwitcher/>
</div>
        {/* Mobile Menu Button */}
        <button
          className="
            md:hidden text-[#1A1A1A] dark:text-[#F1F5F9] 
            hover:text-[#4A6CF7] focus:outline-none 
            hover:scale-110 transition-transform
          "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
</div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              md:hidden 
              bg-[#ffffff] dark:bg-[#0D121A] 
              border-t border-[#E5E7EB] dark:border-[#1F2633]
              shadow-inner
            "
          >
            <ul className="flex flex-col items-center space-y-4 py-4 
              text-[#1A1A1A] dark:text-[#F1F5F9] font-medium">

              <li>
                <Link href="/services" onClick={() => setMenuOpen(false)}
                  className="hover:text-[#4A6CF7] transition-colors">
                  Services
                </Link>
              </li>

              <li>
                <Link href="/apiv2" onClick={() => setMenuOpen(false)}
                  className="hover:text-[#4A6CF7] transition-colors">
                  API
                </Link>
              </li>

              <li>
                <Link href="/blogs" onClick={() => setMenuOpen(false)}
                  className="hover:text-[#4A6CF7] transition-colors">
                  Blogs
                </Link>
              </li>

              {/* Mobile Buttons */}
              <div className="flex flex-col space-y-3 w-3/4 pt-2">

                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block text-center px-4 py-2 
                    bg-[#4A6CF7] hover:bg-[#3f5ed8] 
                    text-white rounded-full font-semibold shadow-md
                  "
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block text-center px-4 py-2 
                    bg-[#16D1A5] hover:bg-[#12b68f] 
                    text-white rounded-full font-semibold shadow-md
                  "
                >
                  Signup
                </Link>

              </div>

            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
