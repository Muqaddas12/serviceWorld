"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCogs, FaCode, FaBlog } from "react-icons/fa";
import Link from "next/link";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className=" top-0 z-50 bg-white shadow-md rounded-tl-3xl rounded-br-3xl mx-auto w-full md:w-4/5">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <img
          src="https://storage.perfectcdn.com/81013d/wzprcb8ileadr37i.png"
          alt="Smm World Panel"
          className="h-8 w-auto"
        />
      </Link>

   {/* Desktop Menu */}
<ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
  <li>
    <a href="/services" className="flex items-center hover:text-blue-600 transition-colors">
      <FaCogs className="text-blue-500 mr-2 text-[18px]" />
      Services
    </a>
  </li>

  <li>
    <a href="/api" className="flex items-center hover:text-blue-600 transition-colors">
      <FaCode className="text-purple-500 mr-2 text-[18px]" />
      API
    </a>
  </li>

  <li>
    <a href="/blogs" className="flex items-center hover:text-blue-600 transition-colors">
      <FaBlog className="text-green-500 mr-2 text-[18px]" />
      Blogs
    </a>
  </li>
</ul>

        {/* Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="/auth/login"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:opacity-90 transition"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full font-semibold hover:opacity-90 transition"
          >
            Signup
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 font-medium">
              <li><a href="/services" className="hover:text-blue-600 transition-colors">Services</a></li>
              <li><a href="/api" className="hover:text-blue-600 transition-colors">API</a></li>
              <li><a href="/blogs" className="hover:text-blue-600 transition-colors">Blogs</a></li>

              <div className="flex flex-col space-y-2 w-3/4">
                <a
                  href="/auth/login"
                  className="block text-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:opacity-90 transition"
                >
                  Login
                </a>
                <a
                  href="/auth/signup"
                  className="block text-center px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full font-semibold hover:opacity-90 transition"
                >
                  Signup
                </a>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
