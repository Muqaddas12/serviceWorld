"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { adminLoginAction } from "@/lib/authentication";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminLoginAction(email, password);

      if (res.success) {
        setMessage("Login successful!");
        router.replace("/admin/dashboard");
      } else {
        setMessage(res.message || "Invalid credentials");
      }
    } catch (err) {
      setMessage("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-8 shadow-lg"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full border border-gray-300">
            <FaUserShield className="text-gray-600 text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your credentials to access the dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-3 rounded-lg 
                bg-gray-100 text-gray-700 
                placeholder-gray-500 
                border border-gray-300
                focus:outline-none focus:border-gray-500
              "
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-4 py-3 rounded-lg 
                bg-gray-100 text-gray-700 
                placeholder-gray-500 
                border border-gray-300
                focus:outline-none focus:border-gray-500
              "
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="
              w-full py-3 rounded-lg font-semibold
              bg-gray-700 text-white
              hover:bg-gray-800 transition
              disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {message && (
          <p className="text-center text-gray-600 mt-4 text-sm">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
