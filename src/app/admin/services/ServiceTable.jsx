"use client";

import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import {  DeleteServiceAction, UpdateServiceStatusAction } from "@/lib/customservices";
import { UpdateMultipleServicesAction } from "@/lib/customservices";
import EditServiceModal from "./EditModal";
import CategoryOption from "./CategoryOption";
export default function ServiceTable({ title, grouped,category }) {
  const disabledStatus = "disabled";
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const dropdownRef = useRef(null);

  // NEW ✅ store multiple selected rows
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 

  const onDelete = async (srv) => {
    const res = await DeleteServiceAction(srv.service);
    alert(res.message);
  };

  const onStatus = async (srv) => {
    const res = await UpdateServiceStatusAction(srv);
    alert(res.message);
  };

  // ✅ toggle single checkbox
  const toggleRow = (key) => {
    setSelectedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // ✅ BULK DELETE FUNCTION
  const bulkDelete = async () => {
    const keys = Object.entries(selectedRows).filter(([_, v]) => v).map(([k]) => k);
    if (keys.length === 0) return alert("No rows selected!");

    for (const key of keys) {
      const [category, idx] = key.split("-");
      const srv = grouped[category][idx];
      await DeleteServiceAction(srv.service);
    }
    alert("Bulk delete completed ✅");
    setSelectedRows({});
  };

  // ✅ BULK EDIT FUNCTION (opens first selected row in modal)
  const bulkEdit = () => {
    const firstKey = Object.entries(selectedRows).find(([_, v]) => v)?.[0];
    if (!firstKey) return alert("No rows selected!");

    const [category, idx] = firstKey.split("-");
    setEditData(grouped[category][idx]);

  };
   const onEdit = async (updated) => {
    
    const res = await UpdateMultipleServicesAction(updated,selectedRows);
    alert(res.message);
    setSelectedRows({});
  };

  return (
    <>
      <div className="mt-8 rounded-2xl shadow-lg overflow-hidden border bg-gray-50 border-gray-300 dark:bg-[#1A1C1F] dark:border-gray-700">
        
        {/* ✅ BULK ACTION BAR */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-[#1E1F23]">
          <div className="text-lg font-bold">{title}</div>

          <div className="flex gap-3">
            <button onClick={bulkEdit} className="px-4 py-1 bg-gray-800 text-white rounded-lg text-sm font-bold">
              Bulk Edit
            </button>

            <button onClick={bulkDelete} className="px-4 py-1 bg-red-600 text-white rounded-lg text-sm font-bold">
              Bulk Delete
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-100 text-gray-700 border-gray-300 dark:bg-[#1E1F23] dark:text-gray-200 dark:border-gray-700">
              <tr>

                {/* ✅ checkbox header */}
                <th className="px-4 py-3 text-center">Select</th>

                <th className="px-4 py-3 text-left">ID</th>

                {/* ✅ Make service column a little big */}
                <th className="px-4 py-3 text-left w-[300px]">Service</th>

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
  {Object.keys(grouped || {}).map((catGroup) => (
    <React.Fragment key={catGroup}>

      {/* ✅ Category Group Heading Row (ONLY TR + TD, no span, no extra node) */}
      <tr className=" bg-gray-200 text-gray-700 dark:bg-[#1E1F23] dark:text-gray-200">
        <td colSpan={11} className="px-4 py-2 font-bold text-sm"><span className="flex ">{catGroup}
          <CategoryOption category={catGroup} services={grouped[catGroup]} onClose={() => setEditData(null)} OnSave={onEdit} ModalCategory={category}/></span></td>
      </tr>

      {/* ✅ Service Rows */}
      {grouped[catGroup].map((srv, idx) => {
        const rowKey = `${catGroup}-${idx}-${srv.name}-${srv.id}`;

        return (
          <tr key={rowKey} className="border-b hover:bg-gray-100 border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200">

            {/* ✅ Checkbox */}
            <td className="px-2 text-center">
              <input
                type="checkbox"
                checked={selectedRows[rowKey] || false}
                onChange={() => toggleRow(rowKey)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </td>

            {/* ✅ ID */}
            <td className=" font-bold">{srv.id}</td>

            {/* ✅ Service Column Wider (little big as you asked) */}
            <td className="px-2 font-extrabold text-sm min-w-[340px]">{srv.name}</td>

            {/* ✅ Type */}
            <td className="px-2">{srv.type}</td>

            {/* ✅ Refill */}
            <td className="px-2">{srv.refill ? "Yes" : "No"}</td>

            {/* ✅ Cancel */}
            <td className="px-2">{srv.cancelAllowed ? "Yes" : "No"}</td>

            {/* ✅ Provider */}
            <td className="px-2 truncate max-w-[240px] text-xs">
              <span className="font-bold block">
                {srv.provider}
              </span>
              <span className="font-xs text-center block font-bold">
                {srv.service}
              </span>
            </td>

            {/* ✅ Price + Profit (unchanged logic ✅) */}
            <td className="px-2">
              <span className="block font-bold text-green-600 dark:text-green-400 text-sm">
                ₹{((srv.rate ?? 0) * (1 + (srv.profitPercentage ?? 0) / 100)).toFixed(2)}
              </span>
              <span className="block font-bold text-xs dark:text-gray-300">
                ₹{srv.rate ?? 0}
              </span>
              <span className="block text-[10px] font-bold text-gray-500">
                Profit: {srv.profitPercentage ?? 0}%
              </span>
            </td>

            {/* ✅ Min */}
            <td className="px-2 text-xs font-bold">{srv.min}</td>

            {/* ✅ Max */}
            <td className="px-2 text-xs font-bold">{srv.max}</td>

            {/* ✅ Status Badge */}
            <td className="px-2 text-center">
              <span
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                  srv.status === "disabled"
                    ? "bg-red-300 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-green-300 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                }`}
              >
                {srv.status === "disabled" ? "Disabled" : "Enabled"}
              </span>
            </td>

            {/* ✅ Action Dropdown */}
            <td className="px-4 py-3 text-center relative">
              <button
                onClick={() => setDropdownOpen(dropdownOpen === rowKey ? null : rowKey)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <BsThreeDotsVertical size={15} className="opacity-70" />
              </button>

              {dropdownOpen === rowKey && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-1.5 w-28 rounded-md shadow bg-white dark:bg-[#1E1F23] border border-gray-300 dark:border-gray-700 text-xs z-50"
                >
                  <button
                    onClick={() => { setDropdownOpen(null); setEditData(srv); }}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(null); setStatusData(srv); }}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  >
                    Change Status
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(null); setDeleteData(srv); }}
                    className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 font-extrabold"
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

      {/* ✅ BULK EDIT MODAL REUSE (untouched behavior) */}
      {editData && <EditServiceModal editData={editData} onSave={onEdit} onClose={() => setEditData(null)} category={category} />}

      {/* ✅ DELETE MODAL (untouched) */}
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

      {/* ✅ STATUS MODAL (untouched) */}
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E1F23] text-sm outline-none dark:text-white"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

            <button
              onClick={() => { onStatus(statusData); setStatusData(null); }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full"
            >
              Save Status
            </button>
          </div>
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
