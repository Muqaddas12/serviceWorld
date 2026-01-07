"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { verifyTokenAction, updatePasswordAction } from "@/lib/resetActions";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [valid, setValid] = useState(null);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null); // ← message state

  const verify = async () => {
    const res = await verifyTokenAction(token);
    setValid(res.valid);

    setMsg({
      type: res.valid ? "success" : "error",
      text: res.valid ? "Link verified. You can now reset your password." : "Invalid or expired link.",
    });
  };

  const updatePass = async () => {
    console.log('hello')
    const res = await updatePasswordAction(token, password);

    setMsg({
      type: res.success ? "success" : "error",
      text: res.message,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
          Reset Password
        </h2>

        {/* Message Box */}
        {msg && (
          <div
            className={`p-2 text-sm rounded ${
              msg.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        {valid === null && (
          <button
            onClick={verify}
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            Verify Reset Link
          </button>
        )}

        {valid === true && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              className="border p-2 rounded w-full bg-gray-50 dark:bg-[#111]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={updatePass}
              className="bg-green-600 text-white p-2 rounded w-full"
            >
              Update Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
