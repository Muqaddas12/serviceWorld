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

export default function DetailsPage({ user }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Loading user...
      </div>
    );

  const profilePic =
    user.profilePic || user.avatar || user.image || user.photo || null;

  // JSON Export
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user.name || "user-details"}.json`;
    link.click();
  };

  // PDF Export
  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("User Details", 14, 20);
    let y = 30;
    for (const [key, value] of Object.entries(user)) {
      doc.text(`${key}: ${String(value)}`, 14, y);
      y += 7;
    }
    doc.save(`${user.name || "user-details"}.pdf`);
  };

  // Word Export
  const exportAsWord = async () => {
    const paragraphs = [
      new Paragraph({
        children: [new TextRun({ text: "User Details", bold: true, size: 28 })],
      }),
      ...Object.entries(user).map(
        ([key, value]) =>
          new Paragraph({
            children: [new TextRun({ text: `${key}: ${String(value)}` })],
          })
      ),
    ];

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user.name || "user-details"}.docx`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 p-4 sm:p-6 md:p-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <UserCircle2 size={32} className="text-gray-500 dark:text-gray-400" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {user.name || "User Details"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Detailed profile view</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <Download size={16} /> Export
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row gap-6 items-center">

          {/* Profile Picture */}
          <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-400 dark:border-gray-600">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <ImageOff size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="w-full sm:flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user.name || "Unnamed User"}</h2>

            <p className="flex justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-1">
              <Mail size={16} /> {user.email || "No Email"}
            </p>

            <p className="flex justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-1">
              <Shield size={16} /> Role: <span>{user.role || "user"}</span>
            </p>

            <p className="flex justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-1">
              <Calendar size={16} /> Joined:{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(user).map(([key, value]) => (
          <div
            key={key}
            className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase text-gray-500 dark:text-gray-400">{key}</span>
              <Hash size={14} className="text-gray-400" />
            </div>
            <p className="break-words">{String(value) || "—"}</p>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4 py-4">
          <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 w-full max-w-xl relative shadow-lg">

            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Export User Details</h2>

            <div className="max-h-[300px] overflow-y-auto bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm">
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 justify-center">

              <button
                onClick={exportAsJSON}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <FileType size={16} /> JSON
              </button>

              <button
                onClick={exportAsPDF}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <FileDown size={16} /> PDF
              </button>

              <button
                onClick={exportAsWord}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <FileText size={16} /> Word
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
