"use client";

import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { DeleteServiceAction, UpdateServiceStatusAction } from "@/lib/customservices";
import { UpdateMultipleServicesAction } from "@/lib/customservices";
import EditServiceModal from "./EditModal";
import CategoryOption from "./CategoryOption";

export default function ServiceTable({ title, grouped = {}, category = [] }) {
  const disabledStatus = "disabled";
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const dropdownRef = useRef(null);
const [deleting,setDeleting]=useState(false)
  const [selectedRows, setSelectedRows] = useState({});

  // -------------------- VISIBLE CATEGORIES (skip empty) --------------------
  const visibleCategories = (category || []).slice(0).filter((catName) => {
    const services = grouped[catName] || [];
    return services.length > 0;
  });

  // -------------------- CLICK OUTSIDE FOR DROPDOWN --------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------- SELECT ROW --------------------
  const toggleRow = (key) => {
    setSelectedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // -------------------- SELECT ALL --------------------
  const handleSelectAll = (checked) => {
    if (!checked) {
      setSelectedRows({});
      return;
    }

    const allSelected = {};

    visibleCategories.forEach((catName) => {
      const services = grouped[catName] || [];
      services.forEach((_, idx) => {
        const rowKey = `${catName}-${idx}`;
        allSelected[rowKey] = true;
      });
    });

    setSelectedRows(allSelected);
  };

const bulkDelete = async () => {
  if (deleting) return; // prevent double clicks
  setDeleting(true);

  const selectedKeys = Object.entries(selectedRows)
    .filter(([_, v]) => v)
    .map(([k]) => k);

    console.log(selectedKeys)
  if (selectedKeys.length === 0) {
    setDeleting(false);
    return alert("No rows selected!");
  }

  try {
    // sequential delete (keeps order and easier error handling)
    for (const key of selectedKeys) {
      const lastDash = key.lastIndexOf("-");
const catName = key.substring(0, lastDash);
const idxStr = key.substring(lastDash + 1);
const idx = Number(idxStr);


      // guard: existence checks
      if (!grouped?.[catName] || Number.isNaN(idx) || !grouped[catName][idx]) {
        console.warn("Skipping invalid selection key:", key,idx,catName,);
        continue;
      }

      const srv = grouped[catName][idx];

      try {
        const res = await DeleteServiceAction(srv.service);
        // optionally check res.success or res.message
      } catch (err) {
        console.error("Failed to delete", srv, err);
        // continue with other deletes instead of aborting everything
      }
    }

    alert("Bulk delete completed");
    setSelectedRows({});
  } catch (err) {
    console.error("Bulk delete: unexpected error", err);
    alert("Something went wrong while deleting. Check console for details.");
  } finally {
    setDeleting(false);
  }
};

  // -------------------- BULK EDIT --------------------
  const bulkEdit = () => {
    const firstKey = Object.entries(selectedRows).find(([_, v]) => v)?.[0];
    if (!firstKey) return alert("No rows selected!");

    const [catName, idx] = firstKey.split("-");
    setEditData(grouped[catName][idx]);
  };

  const onEdit = async (updated) => {
    const res = await UpdateMultipleServicesAction(updated, selectedRows);
    alert(res.message);
    setSelectedRows({});
  };

  // -------------------- DELETE ACTION --------------------
  const onDelete = async (srv) => {
    setDeleting(true)
    const res = await DeleteServiceAction(srv.service);

    alert(res.message);
    setDeleting(false)

  };

  // -------------------- STATUS CHANGE --------------------
  const onStatus = async (srv) => {
    const res = await UpdateServiceStatusAction(srv);
    alert(res.message);
  };

  // ----------------------------------------------------------
  // --------------------   RENDERING PART   -------------------
  // ----------------------------------------------------------

  return (
    <>
 {deleting && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
      <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <h1 className="text-lg font-semibold">Deleting...</h1>
    </div>
  </div>
)}


      <div className="mt-8 rounded-2xl shadow-lg overflow-hidden border bg-gray-50 border-gray-300 dark:bg-[#1A1C1F] dark:border-gray-700">
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-[#1E1F23]">
          <div className="text-lg font-bold">{title}</div>

          <div className="flex gap-3">
            <button onClick={bulkEdit} className="px-4 py-1 bg-gray-800 text-white rounded-lg">
              Bulk Edit
            </button>

            <button onClick={bulkDelete} className="px-4 py-1 bg-red-600 text-white rounded-lg">
              Bulk Delete
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-100 text-gray-700 border-gray-300 dark:bg-[#1E1F23] dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <input type="checkbox" className="w-4 h-4" onChange={(e) => handleSelectAll(e.target.checked)} />
                    <span className="text-xs font-semibold">Select</span>
                  </div>
                </th>

                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3 w-[300px]">Service</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Refill</th>
                <th className="px-4 py-3">Cancel</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Min</th>
                <th className="px-4 py-3">Max</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            {/* CATEGORY + SERVICES */}
            <tbody>
              {visibleCategories.map((catName) => {
                const services = grouped[catName] || [];

                return (
                  <React.Fragment key={catName}>
                    {/* CATEGORY HEADER */}
                    <tr className="bg-gray-200 text-gray-700 dark:bg-[#1E1F23] dark:text-gray-200">
                      <td colSpan={12} className="px-4 py-2 font-bold text-sm">
                        <span className="flex">
                          {catName}
                          <CategoryOption
                            category={catName}
                            services={services}
                            onClose={() => setEditData(null)}
                            ModalCategory={category}
                          />
                        </span>
                      </td>
                    </tr>

                    {/* SERVICES */}
                    {services.map((srv, idx) => {
                      const rowKey = `${catName}-${idx}`;

                      return (
                        <tr key={rowKey} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                          <td className="px-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedRows[rowKey] || false}
                              onChange={() => toggleRow(rowKey)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </td>

                          <td className="font-bold">{srv.id}</td>
                          <td className="px-2 font-extrabold text-sm">{srv.name}</td>
                          <td className="px-2">{srv.type}</td>
                          <td className="px-2">{srv.refill ? "Yes" : "No"}</td>
                          <td className="px-2">{srv.cancelAllowed ? "Yes" : "No"}</td>

                          <td className="px-2 text-xs">
                            <span className="font-bold block">{srv.provider}</span>
                            <span className="font-bold block">{srv.service}</span>
                          </td>

                          <td className="px-2">
                            <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                              ₹{((srv.rate ?? 0) * (1 + (srv.profitPercentage ?? 0) / 100)).toFixed(2)}
                            </span>
                            <br />
                            <span className="font-bold text-xs">₹{srv.rate ?? 0}</span>
                          </td>

                          <td className="px-2 text-xs font-bold">{srv.min}</td>
                          <td className="px-2 text-xs font-bold">{srv.max}</td>

                          <td className="px-2 text-center">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                                srv.status === disabledStatus ? "bg-red-300 text-red-800" : "bg-green-300 text-green-800"
                              }`}
                            >
                              {srv.status === disabledStatus ? "Disabled" : "Enabled"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center relative">
                            <button
                              onClick={() => setDropdownOpen(dropdownOpen === rowKey ? null : rowKey)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <BsThreeDotsVertical size={15} />
                            </button>

                            {dropdownOpen === rowKey && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-1.5 w-28 rounded-md shadow bg-white dark:bg-[#1E1F23] border text-xs z-50"
                              >
                                <button
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    setEditData(srv);
                                  }}
                                  className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    setStatusData(srv);
                                  }}
                                  className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                                >
                                  Change Status
                                </button>

                                <button
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    setDeleteData(srv);
                                  }}
                                  className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-100"
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <EditServiceModal
          editData={editData}
          onSave={onEdit}
          onClose={() => setEditData(null)}
          category={category}
        />
      )}

      {/* DELETE MODAL */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)} title="Delete Service">
          <p className="mb-3 text-center">
            Delete <b>{deleteData.name}</b>?
          </p>
          <button
            onClick={() => {
              onDelete(deleteData);
              setDeleteData(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg w-full"
          >
            Confirm Delete
          </button>
        </Modal>
      )}

      {/* STATUS MODAL */}
      {statusData && (
        <Modal onClose={() => setStatusData(null)} title="Update Service Status">
          <div className="space-y-4">
            <label className="text-sm font-semibold">
              Change status for:
              <p className="mt-1 font-bold text-purple-600">{statusData.name}</p>
            </label>

            <select
              value={statusData.status}
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

            <button
              onClick={() => {
                onStatus(statusData);
                setStatusData(null);
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg w-full"
            >
              Save Status
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

// -------------------- MODAL --------------------
function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1A1C1F] border rounded-xl w-full max-w-md p-5 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <FaTimes size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>

        {children}
      </div>
    </div>
  );
}
