"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SignupForm from "@/app/user/components/Signup";
export default function SignupPage() {
  return (
    <div className=" min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500">
      <Header/>
      <SignupForm />
      <Footer/>
    </div>
  );
}
