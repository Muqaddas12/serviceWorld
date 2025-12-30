// Updated Footer with Light/Dark Theme System
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer({ siteName }) {
  console.log(siteName)
  return (
    <footer className="relative bg-[#F5F7FA] dark:bg-[#0F1117] text-[#1A1A1A] dark:text-white py-6 md:py-8 rounded-t-[30px] shadow-xl overflow-hidden border-t border-[#4A6CF7]/20">
      {/* Animated Blue/Green Glow Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15, rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]
                     bg-gradient-to-tr from-[#4A6CF7] via-[#16D1A5] to-[#4A6CF7]
                     rounded-full blur-3xl absolute top-1/2 left-1/2 
                     -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-1"
        >
          <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4A6CF7] via-[#16D1A5] to-[#4A6CF7] drop-shadow-md">
            Cheapest SMM Panel
          </h3>
          <p className="text-xs md:text-sm text-[#4A5568] dark:text-[#A0AEC3]">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </motion.div>

        {/* Footer Navigation */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-xs md:text-sm font-medium"
        >
          {[{ name: "Privacy Policy", href: "/privacy-policy" }, { name: "Terms of Service", href: "/terms-of-service" }, { name: "Refund Policy", href: "/refund-policy" }, { name: "Contact Us", href: "/contact" }].map((link, i) => (
            <motion.li key={i} whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 250 }}>
              <Link
                href={link.href}
                className="relative text-[#1A1A1A] dark:text-white hover:text-[#4A6CF7] transition-colors duration-300
                           after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
                           after:w-0 after:h-[2px] after:bg-[#4A6CF7]
                           hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Divider */}
      <div className="mt-5 border-t border-[#4A6CF7]/20 w-full" />

      {/* Bottom Note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="text-center text-xs md:text-sm text-[#4A5568] dark:text-[#A0AEC3] mt-3 tracking-wide px-3"
      >
        Made with ❤️ by <span className="text-[#4A6CF7] font-semibold">{siteName||
          'ViralBoost'}</span>
      </motion.p>
    </footer>
  );
}