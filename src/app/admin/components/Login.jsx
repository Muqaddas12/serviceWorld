"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Login successful!");
        // redirect to dashboard
        window.location.href = "/admin/dashboard";
      } else {
        setMessage("❌ " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      setMessage("⚠️ Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white/20 p-4 rounded-full shadow-lg">
            <FaUserShield className="text-white text-4xl" />
          </div>
        </motion.div>

        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Admin Login
        </h2>
        <p className="text-center text-white/80 mb-6 text-sm">
          Enter your credentials to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {message && (
          <p className="text-center text-white mt-4 text-sm">{message}</p>
        )}

        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
