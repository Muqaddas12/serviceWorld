"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "@/lib/authentication";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if (!captchaValue) {
      setMessage("⚠️ Please complete the CAPTCHA");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ ...data, captcha: captchaValue });
      if (res.error) {
        setMessage(res.error);
        setLoading(false)
        return;
      }

      setMessage(res.message);
      router.push("/user/dashboard");
    } catch (err) {
      setMessage("❌ Login failed");
      setLoading(false)
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-4 py-10 sm:px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col gap-5 sm:gap-6"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-md">
          Login
        </h1>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition ${
              errors.email ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition ${
              errors.password ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 sm:top-4 text-gray-300 hover:text-yellow-300 transition cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ReCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 text-gray-900 font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-200 text-sm sm:text-base">
          Don’t have an account?{" "}
          <span
            className="text-yellow-300 font-semibold hover:underline cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </span>
        </p>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-yellow-200 text-sm sm:text-base mt-2"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
