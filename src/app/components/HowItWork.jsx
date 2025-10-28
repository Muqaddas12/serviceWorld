"use client";

import { motion } from "framer-motion";
import { FaUserAlt, FaLink } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";

export default function HowItWorks() {
  return (
    <section className="relative bg-gray-50 text-gray-900 py-24 overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-fuchsia-400/30 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          How It Works
        </h2>

        {/* Steps container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative">
          {/* Step 1 */}
          <Step
            icon={<FaUserAlt className="text-4xl text-fuchsia-500" />}
            title="Create An Account & Add Balance"
            text="Sign up, log in, and add funds to get started."
          />

          {/* Animated Connector Line 1 */}
          <AnimatedConnector />

          {/* Step 2 */}
          <Step
            icon={<MdHomeRepairService className="text-4xl text-purple-500" />}
            title="Select Your Targeted Service"
            text="Pick the service that fits your goals perfectly."
          />

          {/* Animated Connector Line 2 */}
          <AnimatedConnector />

          {/* Step 3 */}
          <Step
            icon={<FaLink className="text-4xl text-indigo-500" />}
            title="Provide Link, Quantity & Watch Results!"
            text="Enter your details, confirm your order, and relax."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex flex-col items-center text-center max-w-xs"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-gray-300">
          {icon}
        </div>
        <motion.span
          className="absolute inset-0 rounded-full border border-gray-200"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </div>
      <h4 className="text-lg font-semibold mb-2 text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}

function AnimatedConnector() {
  return (
    <div className="hidden md:flex items-center justify-center w-16 h-[2px] relative">
      <motion.div
        className="absolute w-full h-[2px] bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 rounded-full"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
