"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if (!captchaValue) { setMessage("Complete CAPTCHA"); return; }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { ...data, captcha: captchaValue });
      setMessage(res.data.message);
      router.push("user/dashboard");
    } catch (err) {
      setMessage(err.response?.data.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">Login</h1>

        {/* Email */}
        <input 
          type="email" 
          placeholder="Email" 
          {...register("email")}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 ${errors.email ? "border-red-500" : ""}`} 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        {/* Password */}
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            {...register("password")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 ${errors.password ? "border-red-500" : ""}`} 
          />
          <span 
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {/* ReCAPTCHA */}
        <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={value => setCaptchaValue(value)} />

        {/* Login Button */}
        <button 
          onClick={handleSubmit(onSubmit)}
          className="w-full py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Already have account / Signup link */}
        <p className="text-center text-gray-700">
          Don't have an account? 
          <span className="text-indigo-600 font-semibold cursor-pointer ml-1" onClick={() => router.push("/auth/signup")}>
            Sign Up
          </span>
        </p>

        {/* Message */}
        {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-black">{message}</motion.p>}
      </motion.div>
    </div>
  );
}
