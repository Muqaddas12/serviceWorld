// Updated LoginForm with Icons + Light/Dark Theme System
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
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

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

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
        setLoading(false);
        return;
      }

      setMessage(res.message);
      router.push("/user/dashboard");
    } catch {
      setMessage("❌ Login failed");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0F1117] px-4 py-10 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-[#1A1F2B] border border-[#4A6CF7]/20 p-8 rounded-3xl shadow-xl flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#4A6CF7] to-[#16D1A5] text-transparent bg-clip-text drop-shadow-md">
          Login
        </h1>

        {/* Email Input */}
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-3.5 text-[#4A5568] dark:text-[#A0AEC3]" />

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0F1117] border border-[#4A6CF7]/20 
            text-[#1A1A1A] dark:text-white placeholder-[#4A5568] 
            dark:placeholder-[#A0AEC3] focus:ring-2 focus:ring-[#4A6CF7] 
            focus:outline-none transition ${
              errors.email ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-4 top-3.5 text-[#4A5568] dark:text-[#A0AEC3]" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full pl-12 pr-12 py-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0F1117] border border-[#4A6CF7]/20 
            text-[#1A1A1A] dark:text-white placeholder-[#4A5568] 
            dark:placeholder-[#A0AEC3] focus:ring-2 focus:ring-[#4A6CF7] 
            focus:outline-none transition ${
              errors.password ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />

          {/* Show/Hide Password */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-[#4A5568] dark:text-[#A0AEC3] hover:text-[#4A6CF7] transition cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

       {/* CAPTCHA (Responsive) */}
<div className="w-full flex justify-center">
  <div className="origin-top scale-[0.85] sm:scale-100">
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      onChange={(value) => setCaptchaValue(value)}
    />
  </div>
</div>


        {/* Login Button */}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full py-3 bg-[#4A6CF7] hover:bg-[#3f5ed8] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-[#4A5568] dark:text-[#A0AEC3] text-sm">
          Don’t have an account?{" "}
          <span
            className="text-[#4A6CF7] font-semibold hover:underline cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </span>
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 mt-2 rounded-xl flex items-center justify-center gap-2 bg-[#F5F7FA] dark:bg-[#0F1117] border border-[#4A6CF7]/20 text-[#1A1A1A] dark:text-white font-semibold hover:text-[#4A6CF7] hover:shadow-md transition"
        >
          <FaGoogle className="text-[#4A6CF7]" /> Sign in with Google
        </button>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#4A6CF7] text-sm mt-2"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
