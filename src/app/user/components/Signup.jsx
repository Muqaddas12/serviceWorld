"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const schema = yup.object().shape({
  username: yup.string().min(3, "Username must be at least 3 characters").required("Username required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(6, "Password must be at least 6 chars").required("Password required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password required"),
});

export default function SignupForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const usernameValue = watch("username");
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Username availability
  useEffect(() => {
    if (!usernameValue || usernameValue.length < 3) { setUsernameExists(false); return; }
    const debounce = setTimeout(async () => {
      const res = await axios.post("/api/auth/check-username", { username: usernameValue });
      setUsernameExists(res.data.exists);
    }, 500);
    return () => clearTimeout(debounce);
  }, [usernameValue]);

  // Email availability
  useEffect(() => {
    if (!emailValue) { setEmailExists(false); return; }
    const debounce = setTimeout(async () => {
      const res = await axios.post("/api/auth/check-email", { email: emailValue });
      setEmailExists(res.data.exists);
    }, 500);
    return () => clearTimeout(debounce);
  }, [emailValue]);

  const getStrength = () => {
    if (!passwordValue) return 0;
    let s = 0;
    if (passwordValue.length >= 6) s++;
    if (/[A-Z]/.test(passwordValue)) s++;
    if (/[0-9]/.test(passwordValue)) s++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) s++;
    return s;
  };

  const onSubmit = async (data) => {
    if (usernameExists) { setMessage("Username already exists"); return; }
    if (emailExists) { setMessage("Email already exists"); return; }
    if (!captchaValue) { setMessage("Please complete CAPTCHA"); return; }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", { ...data, captcha: captchaValue });
      setMessage(res.data.message);
      router.push("user/dashboard");
    } catch (err) {
      setMessage(err.response?.data.error || "Signup failed");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend OAuth route
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-4 justify-center"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">Create Account</h1>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 ${errors.username || usernameExists ? "border-red-500" : ""}`}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        {usernameExists && <p className="text-red-500 text-sm">Username already taken</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 ${errors.email || emailExists ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        {emailExists && <p className="text-red-500 text-sm">Email already exists</p>}

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

        {/* Password Strength */}
        <div className="h-2 w-full bg-gray-200 rounded">
          <div
            style={{ width: `${(getStrength() / 4) * 100}%` }}
            className="h-2 rounded bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 transition-all"
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

        {/* ReCAPTCHA */}
        <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={value => setCaptchaValue(value)} />

     {/* Submit Button */}
<button
  onClick={handleSubmit(onSubmit)}
  className="w-full py-3 mt-2 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold hover:opacity-90 transition cursor-pointer"
>
  {loading ? "Signing up..." : "Sign Up"}
</button>

<button
  onClick={handleGoogleLogin}
  className="w-full py-3 mt-2 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold hover:opacity-90 transition cursor-pointer"
>
  <FaGoogle /> Sign up with Google
</button>


        {/* Already have account */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </a>
        </p>

        {/* Message */}
        {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-black">{message}</motion.p>}
      </motion.div>
    </div>
  );
}
