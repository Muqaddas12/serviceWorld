"use client";

import React, { useState,useRef,useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { UpdateServiceAction,DeleteServiceAction } from "@/lib/customservices";
const CATEGORY_OPTIONS = [
  "Instagram Shares",
  "Instagram : Comments [ RANDOM ]",
  "Youtube video Views ",
  "Youtube : Comments",
  "Facebook Group Members",
  "facebook Likes",
  "Facebook Profile Followers",
  "Random Gmail buy ❤️",
  "🐥Twitter Tweet Views",
  "Telegram : Post Reaction + Views",
  "Telegram Story Services 🤳",
  "Telegram Shares",
  "Telegram Member [Male/Female]",
  "🐥Twitter Poll Votes 🗳",
  "🐥X - Twitter Views Live",
  "Website Traffic + Refferrer",
  "Website Traffic - SEO FRIENDLY- [Targeted]",
  "Website Traffic from India [+ Choose Referrer]🇮🇳",
  "instagram Reel Views 👀",
  "Telegram Member's [Indian 🇮🇳]",
  " Telegram Members [Low Quality]",
  "Telegram Post Views One-Click Done",
  "Telegram Views [ Future Post ]",
  "YouTube Likes",
  "WhatsApp Channel Members [ Fast ]🆕",
  "Instagram Reach + Impression/Post Shares",
  "Instagram [ DM Services ]",
  "Instagram live Video views [ NoN~Drop ] ",
  "Instagram Poll Votes [ Working ]",
  "Instagram Post Save [ Indian ] ",
  "Instagram Post Shares [ Indian ]",
  "YouTube Likes ( One Click Done )",
  "Facebook Story Views ( One Click Done )",
  "Facebook Reels/Video Views [ Non-Drop ]",
  "Facebook Story Reactions ( One Click Done )",
  "Facebook Post Likes ( One Click Done )",
  "Facebook Post Reactions [ ULTRA FAST ]",
  "Facebook Post Reactions [ Working Update ]",
  "𝐈𝐆 𝐅𝐎𝐋𝐋𝐎𝐖𝐄𝐑𝐒 𝐂𝐇𝐄𝐀𝐏𝐄𝐒𝐓 ",
  "𝗜𝗚 𝗥𝗲𝗲𝗹𝘀 𝗩𝗶𝗲𝘄𝘀 [ 𝗖𝗵𝗲𝗮𝗽 ] ",
  "instagram likes [ Non Drop ]",
  "Facebook",
];

export default function ServiceTable({
  title,
  grouped,

  setSelectedService,

  
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
const dropdownRef = useRef(null);
const formRef = useRef(null);
// Close dropdown on outside click
useEffect(() => {
  function handleClickOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(null);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
const onEdit=async(updated)=>{
const res=await UpdateServiceAction(updated)
if(!res.status){
    alert(res.message)
    return 

}
alert(res.message)

}
  /* ----------------------------------------------------
    SORT: Custom services first in each category
  ---------------------------------------------------- */
  const orderedCategories = Object.keys(grouped || {}).sort((a, b) => {
    const aCustom = grouped[a]?.some((s) => s.customservice);
    const bCustom = grouped[b]?.some((s) => s.customservice);
    return aCustom === bCustom ? 0 : aCustom ? -1 : 1;
  });
const onDelete=async(service)=>{
const res=await DeleteServiceAction(service.service)
if(!res.status){
    alert(res.message)
    return
}
alert(res.message)
}
  return (
    <>
      {/* ================= TABLE WRAPPER ================= */}
      <div
        className="mt-8 rounded-2xl shadow-lg overflow-hidden border 
        bg-gray-50 border-gray-300
        dark:bg-[#1A1C1F] dark:border-gray-700"
      >
        {/* HEADER */}
        <div
          className={`px-4 py-3 text-lg font-bold border-b
   
  `}
        >
          {title}
        </div>
{/* DESKTOP TABLE */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full text-sm">
    <thead className="border-b bg-gray-100 text-gray-700 border-gray-300 dark:bg-[#1E1F23] dark:text-gray-200 dark:border-gray-700">
      <tr>
        <th className="px-4 py-3 text-left">ID</th>
        <th className="px-4 py-3 text-left">Service</th>
        <th className="px-4 py-3 text-left">Service Type</th>
        <th className="px-4 py-3 text-left">Refill</th>
        <th className="px-4 py-3 text-left">Cancel</th>
        <th className="px-4 py-3 text-left">Provider</th>
        <th className="px-4 py-3 text-left">Price</th>
        <th className="px-4 py-3 text-left">Min</th>
        <th className="px-4 py-3 text-left">Max</th>
        <th className="px-4 py-3 text-left">Status</th>
        <th className="px-4 py-3 text-center">Action</th>
      </tr>
    </thead>

    <tbody>
      {orderedCategories.length === 0 && (
        <tr>
          <td
            colSpan={11}
            className="py-6 text-center text-gray-500 dark:text-gray-400"
          >
            No services available.
          </td>
        </tr>
      )}

      {orderedCategories.map((category) => (
        <React.Fragment key={category}>
          {/* Category Header */}
          <tr className="bg-gray-200 text-gray-700 dark:bg-[#1E1F23] dark:text-gray-200">
            <td colSpan={11} className="px-4 py-2 font-bold text-lg">
              {category}
            </td>
          </tr>

          {/** CUSTOM SERVICES FIRST */}
          {[...grouped[category]]
            .sort((a, b) => (a.customservice === b.customservice ? 0 : a.customservice ? -1 : 1))
            .map((srv, idx) => {
              const rowKey = `${category}-${srv.id ?? idx}-${srv.name}`;

              return (
                <tr
                  key={rowKey}
                  className="border-b hover:bg-gray-100 border-gray-300
                  text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
                >
                  <td className="px-4 py-3">{srv.service}</td>

                  <td className="px-4 py-3 flex items-center gap-2">
                    {srv.name}
                    {srv.customservice && (
                      <span className="px-2 py-1 text-xs rounded bg-purple-200 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        Custom
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">{srv.type}</td>
                  <td className="px-4 py-3">{srv.refill ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{srv.cancelAllowed ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{srv.provider}</td>
                  <td className="px-4 py-3">₹{srv.rate}</td>
                  <td className="px-4 py-3">{srv.min}</td>
                  <td className="px-4 py-3">{srv.max}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        srv.status === "enabled"
                          ? "bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {srv.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {/* Custom services have dropdown */}
                    {srv.customservice ? (
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === rowKey ? null : rowKey)
                          }
                          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>

                        {dropdownOpen === rowKey && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-32 rounded-lg shadow bg-white 
                            border dark:bg-[#1E1F23] dark:border-gray-700 text-sm text-gray-700 
                            dark:text-gray-200 z-50"
                          >
                            <button
                              onClick={() => {
                                setDropdownOpen(null);
                                setEditData(srv);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                setDropdownOpen(null);
                                setDeleteData(srv);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 dark:hover:bg-red-900/40"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedService(srv)}
                        className="px-4 py-1 text-xs border rounded-md border-gray-400 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>

       
      </div>

      {/* ==================== EDIT POPUP ==================== */}
{editData && (
  <Modal onClose={() => setEditData(null)} title="Edit Service">

    <form
      ref={formRef}
      className="max-h-[70vh] overflow-y-auto pr-2 space-y-4 text-gray-700 dark:text-gray-300"
    >
     {Object.entries(editData)
  .filter(([key]) => !["createdAt", "updatedAt", "customservice"].includes(key))
  .map(([key, value]) => (
    <div key={key} className="flex flex-col gap-1">
      <label className="font-semibold capitalize">
        {key.replace(/_/g, " ")}
      </label>

      {/* STATUS DROPDOWN */}
      {key === "status" && (
        <select
          name={key}
          defaultValue={value}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border 
            border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 
            dark:text-gray-300 dark:focus:ring-gray-600 w-full"
        >
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      )}

      {/* REFILL */}
      {key === "refill" && (
        <select
          name={key}
          defaultValue={value}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border 
            border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 
            dark:text-gray-300 dark:focus:ring-gray-600 w-full"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )}

      {/* CANCEL ALLOWED */}
      {key === "cancelallowed" && (
        <select
          name={key}
          defaultValue={value}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border 
            border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 
            dark:text-gray-300 dark:focus:ring-gray-600 w-full"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )}

      {/* TYPE DROPDOWN */}
      {key === "type" && (
        <select
          name={key}
          defaultValue={value}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border 
            border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 
            dark:text-gray-300 dark:focus:ring-gray-600 w-full"
        >
          <option value="default">Default</option>
          <option value="speed">Speed</option>
          <option value="quality">Quality</option>
          <option value="keyword">Keyword</option>
        </select>
      )}

      {/* CATEGORY DROPDOWN */}
      {key === "category" && (
        <select
          name={key}
          defaultValue={value}
          className="rounded-lg py-2 px-3 text-sm outline-none bg-white border 
            border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 
            dark:text-gray-300 dark:focus:ring-gray-600 w-full"
        >
          {CATEGORY_OPTIONS.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}

      {/* DEFAULT INPUT */}
      {![ "status", "refill", "cancelallowed", "type", "category" ].includes(key) && (
        <input
          name={key}
          defaultValue={value}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-[#1E1F23] text-gray-800 dark:text-gray-200"
        />
      )}
    </div>
))}

    </form>

    <button
      onClick={() => {
        const fd = new FormData(formRef.current);
        const updated = Object.fromEntries(fd.entries());

        // convert numbers back to number (optional)
        for (let key in updated) {
          if (!isNaN(updated[key])) updated[key] = Number(updated[key]);
        }

        // include customservice + original timestamps again
        updated.customservice = editData.customservice;
        updated.createdAt = editData.createdAt;
        updated.updatedAt = new Date().toISOString();

        onEdit(updated);
        setEditData(null);
      }}
      className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full"
    >
      Save Changes
    </button>
  </Modal>
)}


      {/* ==================== DELETE POPUP ==================== */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)} title="Delete Service">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete service:
            <b> {deleteData.name}?</b>
          </p>

          <button
            onClick={() => {
              onDelete(deleteData);
              setDeleteData(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
          >
            Delete
          </button>
        </Modal>
      )}
    </>
  );
}

/* ==========================================
   MODAL COMPONENT
========================================== */
function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}
