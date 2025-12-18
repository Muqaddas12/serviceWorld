"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="min-h-screen fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* Gradient Circle Logo */}
     <motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: [1, 1.2, 1], opacity: 1 }}
  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
  className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center"
>
  <Image
    src="/fav.png"   // from public folder
    alt="Logo"
    width={40}
    height={40}
    className="object-contain"
  />
</motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent"
      >
        InstantSMM
      </motion.h1>

      {/* Dynamic Message */}
      <motion.p
        key={message}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-3 text-gray-600 text-sm sm:text-base text-center px-4"
      >
        {message}
      </motion.p>
    </div>
  );
}
