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
      className="relative bg-gradient-to-br from-white via-indigo-50 to-purple-50 
                 shadow-2xl rounded-tl-[40px] rounded-br-[40px] 
                 py-8 sm:py-14 md:py-20 px-4 sm:px-8 md:px-10 lg:px-14 overflow-hidden"
    >
      {/* 🌈 Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25, rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] 
                     bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 
                     rounded-full blur-[120px]"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3, rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] 
                     bg-gradient-to-r from-fuchsia-400 to-blue-400 
                     rounded-full blur-[140px]"
        />
      </div>

      {/* 🌟 Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center max-w-5xl mx-auto relative z-10">
        {/* LEFT SIDE — LOGIN FORM + TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 bg-white/80 backdrop-blur-xl border border-white/50 
                     shadow-lg rounded-2xl p-6 sm:p-8"
        >
           <p className="text-blue-600 font-semibold text-lg">
            website.com
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight flex items-center gap-3 flex-wrap">
            SMM Panel – World’s Best and Cheapest SMM Panel
            <Image
              src="https://storage.perfectcdn.com/81013d/q6es6uk1ctks7bew.svg"
              alt="heading-icon"
              width={35}
              height={35}
              className="inline-block"
            />
          </h1>

          <p className="text-gray-600 text-lg">
            The most usable panel in the world with{" "}
            <span className="text-blue-600 font-semibold">82,045,541</span>{" "}
            orders until now! Are you in?
          </p>

          {/* ✅ Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className={`w-full pl-10 pr-3 py-3 border rounded-xl 
                           bg-white/70 text-gray-900 placeholder-gray-500 
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                             errors.email ? "border-red-500" : "border-gray-300"
                           }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
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
                className={`w-full pl-10 pr-3 py-3 border rounded-xl 
                           bg-white/70 text-gray-900 placeholder-gray-500 
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                             errors.password
                               ? "border-red-500"
                               : "border-gray-300"
                           }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center scale-90 sm:scale-100">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-xs sm:text-sm">
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 font-semibold rounded-xl 
                         text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
                         shadow-md hover:opacity-90 transition-all text-sm sm:text-base"
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

            <p className="text-center text-gray-700 text-xs sm:text-sm">
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
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-[360px] md:h-[360px] 
                          rounded-2xl overflow-hidden shadow-xl">
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
