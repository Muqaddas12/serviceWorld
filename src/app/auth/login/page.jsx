"use client";
import LoginForm from "@/app/user/components/Login";
import Header from "@/app/user/components/Header";
export default function LoginPage() {
  return (
    <div className=" min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500">
      <Header/>
    <LoginForm/>
    <Footer/> 
    </div>
  );
}
