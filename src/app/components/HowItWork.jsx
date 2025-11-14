"use client";

import { motion } from "framer-motion";
import { FaUserAlt, FaLink } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";

export default function HowItWorks() {
  return (
    <section className="relative text-gray-300 py-24">
      
      {/* ✨ Floating Golden Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(45)].map((_, i) => {
          const size = Math.random() * 3 + 2;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const endX = Math.random() * 100;
          const endY = Math.random() * 100;

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh` }}
              animate={{
                opacity: [0.1, 1, 0.1],
                x: [`${startX}vw`, `${endX}vw`, `${startX}vw`],
                y: [`${startY}vh`, `${endY}vh`, `${startY}vh`],
              }}
              transition={{
                duration: 12 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bg-yellow-400 rounded-full blur-[2px]"
              style={{ width: size, height: size }}
            />
          );
        })}
      </div>

      {/* Golden Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-yellow-600/20 rounded-full blur-[180px] bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-16 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600"
        >
          How It Works
        </motion.h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-14 md:gap-20 relative">
          
          <Step
            icon={<FaUserAlt className="text-4xl text-yellow-400" />}
            title="Create Account & Add Balance"
            text="Register quickly, login securely, and top up your wallet to start using premium SMM services."
            delay={0.1}
          />

          <AnimatedConnector />

          <Step
            icon={<MdHomeRepairService className="text-4xl text-yellow-400" />}
            title="Choose Your Service"
            text="Explore our verified high-quality social media services tailored for fast growth."
            delay={0.3}
          />

          <AnimatedConnector />

          <Step
            icon={<FaLink className="text-4xl text-yellow-400" />}
            title="Provide Link & Enjoy Results"
            text="Submit your URL and quantity. Relax while the results are delivered automatically."
            delay={0.5}
          />

        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center text-center max-w-xs p-6 rounded-2xl 
                 bg-[#151517] border border-yellow-500/20 
                 shadow-[0_0_25px_rgba(255,221,64,0.1)] hover:shadow-[0_0_40px_rgba(255,221,64,0.2)] 
                 transition-all duration-300"
    >
      
      {/* Icon with pulse glow */}
      <div className="relative mb-6">
        <motion.div
          className="w-20 h-20 rounded-full bg-[#0e0e0f] border border-yellow-500/30 
                     flex items-center justify-center text-yellow-400 shadow-[0_0_25px_rgba(255,221,64,0.2)]"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,221,64,0.3)",
              "0 0 35px rgba(255,221,64,0.6)",
              "0 0 20px rgba(255,221,64,0.3)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>

        {/* Rotating ring */}
        <motion.span
          className="absolute inset-0 rounded-full border border-yellow-500/30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
      </div>

      <h4 className="text-lg font-semibold text-yellow-400 mb-2">
        {title}
      </h4>

      <p className="text-gray-400 text-sm leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

function AnimatedConnector() {
  return (
    <div className="hidden md:flex items-center justify-center w-20 h-[2px] relative">
      <motion.div
        className="absolute w-full h-[3px] 
                   bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 rounded-full"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-4 h-4 
                   bg-gradient-to-r from-yellow-600 to-yellow-400 
                   rounded-full shadow-[0_0_15px_rgba(255,221,64,0.6)]"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
