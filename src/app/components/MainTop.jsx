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

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setMessage("");

    // Get CAPTCHA token
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
      className="relative bg-white shadow-md rounded-tl-[50px] rounded-br-[50px] py-16 px-6 md:px-12 overflow-hidden mt-20"
    >
      {/* 🌈 Animated Background */}
      <div className="absolute inset-0 flex justify-center items-center -z-10 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[700px] h-[700px] md:w-[900px] md:h-[900px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto relative z-10">
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <p className="text-blue-600 font-semibold text-lg">websitename.com</p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight flex items-center gap-3 flex-wrap">
            SMM World Panel – World’s Best and Cheapest SMM Panel
            <Image
              src="https://storage.perfectcdn.com/81013d/q6es6uk1ctks7bew.svg"
              alt="heading-icon"
              width={35}
              height={35}
            />
          </h1>

          <p className="text-gray-600 text-lg">
            The most usable panel in the world with{" "}
            <span className="text-blue-600 font-semibold">82,045,541</span>{" "}
            orders until now! Are you in?
          </p>

          {/* ✅ Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black ${
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* ✅ reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded text-blue-600" />
                Remember me
              </label>
              <a href="/resetpassword" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-2 rounded-xl shadow-md hover:opacity-90 transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-700"
              >
                {message}
              </motion.p>
            )}

            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </motion.div>

        {/* RIGHT: Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative w-80 h-80 md:w-[400px] md:h-[400px]">
            <Image
              src="https://storage.perfectcdn.com/81013d/cisiri3e4fe0qu1o.webp"
              alt="hero"
              fill
              className="object-contain rounded-3xl drop-shadow-lg"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
