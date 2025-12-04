"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Wait a moment so cookie applies
    setTimeout(() => {
      router.replace("/user/dashboard");
    }, 100);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-xl">
      Signing you in...
    </div>
  );
}
