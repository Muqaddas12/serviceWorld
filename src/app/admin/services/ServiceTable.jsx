"use client";

import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { UpdateServiceAction, DeleteServiceAction, UpdateServiceStatusAction } from "@/lib/customservices";
import EditServiceModal from "./EditModal";

export default function ServiceTable({ title, grouped }) {
  const disabled="disabled"
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const dropdownRef = useRef(null);
const [statusData, setStatusData] = useState(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEdit = async (updated) => {
    const res = await UpdateServiceAction(updated);
    alert(res.message);
  };

  const onDelete = async (srv) => {
    const res = await DeleteServiceAction(srv.service);
    alert(res.message);
  };
const onStatus=async(data)=>{
  console.log(data)
const res=await UpdateServiceStatusAction(data)
alert(res.message)
}
  return (
    <>
      <div className="mt-8 rounded-2xl shadow-lg overflow-hidden border bg-gray-50 border-gray-300 dark:bg-[#1A1C1F] dark:border-gray-700">
        <div className="px-4 py-3 text-lg font-bold border-b">{title}</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-100 text-gray-700 border-gray-300 dark:bg-[#1E1F23] dark:text-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Type</th>
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
              {Object.keys(grouped || {}).map((category) => (
                <React.Fragment key={category}>
                  <tr className="bg-gray-200 text-gray-700 dark:bg-[#1E1F23] dark:text-gray-200">
                    <td colSpan={11} className="px-4 py-2 font-bold text-lg">{category}</td>
                  </tr>

                  {grouped[category].map((srv, idx) => {
                    const rowKey = `${category}-${idx}-${srv.name}`;

                    return (
                      <tr key={rowKey} className="border-b hover:bg-gray-100 border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200">
                        <td className="px-4 py-3">{srv.service}</td>
                        <td className="px-4 py-3">{srv.name}</td>
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
    srv.status === "disabled"
      ? "bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300"
  }`}
>
  {(srv.status) === disabled ? "Disabled" : "Enabled"}
</span>



                        </td>

                        {/* 3 DOTS DROPDOWN */}
                        <td className="px-4 py-3 text-center relative">
                          <button
                            onClick={() => setDropdownOpen(dropdownOpen === rowKey ? null : rowKey)}
                            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <BsThreeDotsVertical size={18} />
                          </button>

                          {dropdownOpen === rowKey && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-28 rounded-lg shadow bg-white border dark:bg-[#1E1F23] dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 z-50"
                            >
                              <button
                                onClick={() => { setDropdownOpen(null); setEditData(srv); }}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                Edit
                              </button>
<button
  onClick={() => {
    setDropdownOpen(null);
    setStatusData(srv);  // open status modal instead
  }}
  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-red-100 dark:hover:bg-red-900/40"
>
  Status
</button>
                              <button
                                onClick={() => { setDropdownOpen(null); setDeleteData(srv); }}
                                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40"
                              >
                                Delete
                              </button>
                             
                            </div>
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
{editData && <EditServiceModal editData={editData} onSave={onEdit} onClose={() => setEditData(null)} />}
{/* STATUS MODAL */}
{statusData && (
  <Modal onClose={() => setStatusData(null)} title="Update Service Status">
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Change Status for:
        <p className="mt-1 font-bold text-purple-600">{statusData.name}</p>
      </label>

      <select
        value={statusData.status}
        onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#1E1F23] text-sm outline-none dark:text-white"
      >
        <option value="enabled">Enabled</option>
        <option value="disabled">Disabled</option>
      </select>

      <button
        onClick={() => {
          onStatus(statusData); // ✅ reuse your update function
          setStatusData(null);
        }}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full"
      >
        Save Status
      </button>
    </div>
  </Modal>
)}


      {/* DELETE MODAL */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)} title="Delete Service">
          <p className="mb-3 text-center">Delete <b>{deleteData.name}</b>?</p>
          <button
            onClick={() => { onDelete(deleteData); setDeleteData(null); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
          >
            Confirm Delete
          </button>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-xl w-full max-w-md p-5 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-300">
          <FaTimes size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}
