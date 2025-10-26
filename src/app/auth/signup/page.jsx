"use client";
import Footer from "@/app/user/components/Footer";
import SignupForm from "@/app/user/components/Signup";
import Header from "@/app/user/components/Header";

export default function SignupPage() {
  return (
    <div className=" min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500">
      <Header/>
      <SignupForm />
      <Footer/>
    </div>
  );
}
