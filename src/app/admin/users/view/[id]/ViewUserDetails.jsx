"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Mail,
  UserCircle2,
  Calendar,
  Hash,
  ImageOff,
  Download,
  FileDown,
  FileText,
  FileType,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function ViewUserDetails({ user }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-lg p-4 text-center">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400 text-lg p-4 text-center">
        Loading user...
      </div>
    );

  const profilePic =
    user.profilePic || user.avatar || user.image || user.photo || null;

  // 🟡 Export as JSON
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${user.name || "user-details"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🔵 Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("User Details", 14, 20);
    doc.setFontSize(10);
    let y = 30;
    for (const [key, value] of Object.entries(user)) {
      doc.text(`${key}: ${String(value)}`, 14, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    }
    doc.save(`${user.name || "user-details"}.pdf`);
  };

  // 🔴 Export as Word
  const exportAsWord = async () => {
    const paragraphs = [
      new Paragraph({
        children: [new TextRun({ text: "User Details", bold: true, size: 28 })],
      }),
      ...Object.entries(user).map(
        ([key, value]) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `${key}: ${String(value)}`,
                size: 24,
              }),
            ],
          })
      ),
    ];

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${user.name || "user-details"}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0c] via-[#0e0e0f] to-[#141414] text-gray-100 p-4 sm:p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <UserCircle2 className="text-yellow-400 shrink-0" size={32} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
              {user.name || "User Details"}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Detailed profile view
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600/40 to-yellow-500/30 hover:from-yellow-600/60 hover:to-yellow-500/40 border border-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl transition-all w-full sm:w-auto"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700/40 to-gray-600/30 hover:from-gray-700/60 hover:to-gray-600/40 border border-gray-500/20 text-gray-300 px-4 py-2 rounded-xl transition-all w-full sm:w-auto"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-5 sm:p-6 shadow-lg mb-10 hover:border-yellow-500/40 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-500/30 shadow-md">
            {profilePic ? (
              <img
                src={profilePic}
                alt={user.name || "Profile"}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-yellow-700/40 to-yellow-400/20 flex items-center justify-center">
                <ImageOff size={40} className="text-yellow-400/70" />
              </div>
            )}
          </div>

          <div className="text-center sm:text-left w-full sm:flex-1">
            <h2 className="text-2xl font-semibold text-yellow-400 break-words">
              {user.name || "Unnamed User"}
            </h2>

            <p className="text-gray-400 flex justify-center sm:justify-start items-center gap-2 mt-1 text-sm sm:text-base">
              <Mail size={16} className="text-gray-500" />{" "}
              {user.email || "No Email"}
            </p>

            <p className="text-gray-400 flex justify-center sm:justify-start items-center gap-2 mt-1 text-sm sm:text-base">
              <Shield size={16} className="text-gray-500" /> Role:{" "}
              <span className="capitalize text-yellow-300">
                {user.role || "user"}
              </span>
            </p>

            <p className="text-gray-400 flex justify-center sm:justify-start items-center gap-2 mt-1 text-sm sm:text-base">
              <Calendar size={16} className="text-gray-500" /> Joined:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {Object.entries(user).map(([key, value]) => (
          <div
            key={key}
            className="bg-gradient-to-b from-[#1a1a1c] to-[#101010] border border-yellow-500/10 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide break-words">
                {key}
              </span>
              <Hash size={14} className="text-gray-500 shrink-0" />
            </div>
            <p className="text-gray-200 text-sm sm:text-base break-words">
              {String(value) || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] border border-yellow-500/30 rounded-2xl p-6 w-[90%] max-w-2xl text-gray-100 relative shadow-2xl">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              Export User Details
            </h2>

            <div className="max-h-[300px] overflow-y-auto border border-yellow-500/10 rounded-xl p-3 bg-[#1a1a1c] mb-4 text-sm">
              <pre className="text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={exportAsJSON}
                className="flex items-center gap-2 bg-green-600/30 hover:bg-green-600/50 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg transition-all"
              >
                <FileType size={16} /> Export JSON
              </button>
              <button
                onClick={exportAsPDF}
                className="flex items-center gap-2 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all"
              >
                <FileDown size={16} /> Export PDF
              </button>
              <button
                onClick={exportAsWord}
                className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-all"
              >
                <FileText size={16} /> Export Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
