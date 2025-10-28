"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PaymentMethods() {
  return (
    <section className="relative bg-white py-16 px-6 md:px-12 shadow-md rounded-2xl mt-16 overflow-hidden">
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[700px] h-[700px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl"
        />
      </div>

      {/* 💳 Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12"
      >
        We Accept Multiple Payment Methods
      </motion.h2>

      {/* 💠 Images */}
      <div className="flex flex-col items-center justify-center">
        {/* Desktop image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block"
        >
          <Image
            src="https://cdn.mypanel.link/hmz1fi/srtwbbr2kkl8qjg8.png"
            alt="payment methods desktop"
            width={1000}
            height={400}
            className="rounded-xl shadow-lg object-contain"
          />
        </motion.div>

        {/* Mobile image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:hidden"
        >
          <Image
            src="https://cdn.mypanel.link/hmz1fi/187e2gr6e4bsaxz1.png"
            alt="payment methods mobile"
            width={400}
            height={400}
            className="rounded-xl shadow-md object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
