"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "@/lib/authentication";
import { Mail, Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email required"),
  password: yup.string().required("Password required"),
});

export default function MainTop({ websiteName }) {
  const router = useRouter();
  const recaptchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

   const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setMessage("");
    const captcha = recaptchaRef.current?.getValue();

    if (!captcha) {
      setMessage("Please complete the CAPTCHA.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ ...data, captcha });

      if (!res.success) {
        setMessage(res.message || res.error);
      } else {
        router.replace("/user/dashboard");
      }
    } catch (err) {
      setMessage(err?.message || "Login failed.");
    } finally {
      recaptchaRef.current?.reset();
      setLoading(false);
    }
  };

  return (
    <section
      className="
        py-12 sm:py-16 md:py-20 
        px-4 sm:px-8 lg:px-14 
        bg-[#F5F7FA] dark:bg-[#0F1117]
        transition-colors duration-300
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">

        {/* LEFT — LOGIN FORM */}
        <div
          className="
            p-6 sm:p-8 
            bg-white dark:bg-[#1A1F2B]
            rounded-2xl shadow-xl
            text-[#1A1A1A] dark:text-white
            transition-colors duration-300
            space-y-6
          "
        >
          <p className="text-[#4A6CF7] font-semibold text-lg">
            {websiteName}
          </p>
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
  SMM Panel – Fastest & Cheapest Services Worldwide
</h1>


          <p className="text-[#4A5568] dark:text-[#A0AEC3] text-lg">
            Over <span className="text-[#4A6CF7] font-semibold">82,045,541+</span> orders processed!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568] dark:text-[#A0AEC3] w-5 h-5" />

  <input
    type="email"
    placeholder="Email"
    {...register("email")}
    className={`
      w-full pl-10 pr-4 py-3 rounded-xl
      bg-white dark:bg-[#1A1F2B]
      text-[#1A1A1A] dark:text-white
      placeholder-[#4A5568] dark:placeholder-[#A0AEC3]
      border 
      ${errors.email ? "border-red-500" : "border-[#4A6CF7]/30"}
      focus:ring-2 focus:ring-[#4A6CF7]
      outline-none
    `}
  />
  {errors.email && (
    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
  )}
</div>


            {/* Password */}
           <div className="relative">
  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568] dark:text-[#A0AEC3] w-5 h-5" />

  <input
    type="password"
    placeholder="Password"
    {...register("password")}
    className={`
      w-full pl-10 pr-4 py-3 rounded-xl
      bg-white dark:bg-[#1A1F2B]
      text-[#1A1A1A] dark:text-white
      placeholder-[#4A5568] dark:placeholder-[#A0AEC3]
      border 
      ${errors.password ? "border-red-500" : "border-[#4A6CF7]/30"}
      focus:ring-2 focus:ring-[#4A6CF7]
      outline-none
    `}
  />
  {errors.password && (
    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
  )}
</div>


           {/* CAPTCHA (Responsive) */}
<div className="w-full flex justify-center">
  <div className="scale-[0.85] sm:scale-100 origin-top">
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    />
  </div>
</div>


            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm text-[#4A5568] dark:text-[#A0AEC3]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#4A6CF7]" /> Remember me
              </label>
              <a href="/resetpassword" className="text-[#4A6CF7] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl font-semibold
                bg-[#4A6CF7] hover:bg-[#3f5ed8]
                text-white shadow-lg transition
              "
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
  {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 mt-2 rounded-xl flex items-center justify-center gap-2 bg-[#F5F7FA] dark:bg-[#0F1117] border border-[#4A6CF7]/20 text-[#1A1A1A] dark:text-white font-semibold hover:text-[#4A6CF7] hover:shadow-md transition"
        >
          <FaGoogle className="text-[#4A6CF7]" /> Sign in with Google
        </button>
            {message && (
              <p className="text-center text-[#4A6CF7] text-sm">{message}</p>
            )}

            <p className="text-center text-sm text-[#4A5568] dark:text-[#A0AEC3]">
              Don’t have an account?{" "}
              <a href="/auth/signup" className="text-[#4A6CF7] font-semibold">
                Sign up
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT — HERO IMAGE */}
      <div className="flex justify-center md:justify-end">
  <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
    <Image
      src="https://storage.perfectcdn.com/81013d/cisiri3e4fe0qu1o.webp"
      alt="hero"
      fill
      className="object-contain"
    />
  </div>
</div>


      </div>
    </section>
  );
}
