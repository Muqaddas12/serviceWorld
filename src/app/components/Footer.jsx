"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-8 mt-16 rounded-t-3xl shadow-lg overflow-hidden">
      {/* 🌈 Animated Gradient Glow Circle */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-30">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[600px] h-[600px] bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* 🄰 Left Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm md:text-base font-medium"
        >
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">Cheapest SMM Panel</span>. All Rights Reserved.
        </motion.p>

        {/* 🄱 Right Links */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center md:justify-end gap-4 text-sm font-medium"
        >
          <li>
            <Link
              href="/privacy-policy"
              className="hover:text-yellow-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-yellow-300 transition-colors">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link
              href="/refund-policy"
              className="hover:text-yellow-300 transition-colors"
            >
              Refund Policy
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-yellow-300 transition-colors">
              Contact Us
            </Link>
          </li>
        </motion.ul>
      </div>
    </footer>
  );
}
