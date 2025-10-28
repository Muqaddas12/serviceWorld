"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function MainTop() {
  const router = useRouter();
  const recaptchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setMessage("");
    const captcha = recaptchaRef.current?.getValue();
    if (!captcha) {
      setMessage("Please complete the CAPTCHA before logging in.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
        captcha,
      });
      setMessage(res.data.message || "Login successful!");
      router.push("/user/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      recaptchaRef.current?.reset();
      setLoading(false);
    }
  };

  return (
    <section
      id="main-top"
      className="relative bg-gradient-to-br from-white via-indigo-50 to-purple-50 shadow-2xl rounded-tl-[50px] rounded-br-[50px] py-16 px-6 md:px-12 overflow-hidden py-20"
    >
      {/* 🌈 Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25, rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-150px] left-[-150px] w-[700px] h-[700px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3, rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] bg-gradient-to-r from-fuchsia-400 to-blue-400 rounded-full blur-[180px]"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center max-w-6xl mx-auto relative z-10">
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-7 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8"
        >
          <p className="text-indigo-600 font-semibold text-lg tracking-wide">
            websitename.com
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center gap-3 flex-wrap">
         SMM World Panel – The Most Trusted and Affordable Growth Platform Worldwide.
            <Image
              src="https://storage.perfectcdn.com/81013d/q6es6uk1ctks7bew.svg"
              alt="heading-icon"
              width={100}
              height={100}
            />
          </h1>

          <p className="text-gray-700 text-lg">
            Trusted by {" "}
            <span className="text-indigo-600 font-semibold">Millions</span>{" "}
           Fueling Global Social Growth with Confidence.
          </p>

          {/* ✅ Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src="https://storage.perfectcdn.com/81013d/idw6edksk00rd927.svg"
                  alt="email icon"
                  width={18}
                  height={18}
                />
              </span>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`w-full pl-10 pr-3 py-3 border rounded-xl bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src="https://storage.perfectcdn.com/81013d/m7nhhy1g6cdbc9om.svg"
                  alt="password icon"
                  width={18}
                  height={18}
                />
              </span>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={`w-full pl-10 pr-3 py-3 border rounded-xl bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded text-indigo-600" />
                Remember me
              </label>
              <a
                href="/resetpassword"
                className="text-indigo-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg hover:opacity-90 transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-700"
              >
                {message}
              </motion.p>
            )}

            <p className="text-center text-gray-700 text-sm">
              Don’t have an account?{" "}
              <a
                href="/auth/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </motion.div>

        {/* RIGHT HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://storage.perfectcdn.com/81013d/cisiri3e4fe0qu1o.webp"
              alt="hero"
              fill
              className="object-contain scale-105 hover:scale-110 transition-transform duration-700"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
