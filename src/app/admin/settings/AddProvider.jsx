"use client";

import { Edit, Trash2, Info, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addProviderAction,
  getProvidersAction,
  updateProviderAction,
  deleteProviderAction,
} from "@/lib/providerActions";

export default function AddProvider() {
  const [providers, setProviders] = useState([]);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [providerId, setProviderId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerUrl, setProviderUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  /* ----------- MESSAGE SYSTEM ----------- */
  const [message, setMessage] = useState(null); // {type:'success'|'error', text:''}

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Load Providers from DB
  async function loadProviders() {
    setTableLoading(true);
    const res = await getProvidersAction();
    setProviders(res || []);
    setTableLoading(false);
  }

  useEffect(() => {
    loadProviders();
  }, []);

  /* ---------------------- ADD PROVIDER ---------------------- */

  const handleAdd = async () => {
    if (!providerId || !providerName || !providerUrl || !apiKey) {
      showMessage("error", "Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await addProviderAction({
      id: Number(providerId),
      name: providerName,
      providerUrl,
      apiKey,
    });

    setLoading(false);

    if (!res.status) return showMessage("error", res.message);

    showMessage("success", "Provider added successfully!");

    setShowAddPopup(false);
    resetForm();
    loadProviders();
  };

  /* ---------------------- EDIT PROVIDER ---------------------- */

  const openEditPopup = (item) => {
    setEditData(item);
    setProviderId(item.id);
    setProviderName(item.name);
    setProviderUrl(item.providerUrl);
    setApiKey(item.apiKey);
    setShowEditPopup(true);
  };

  const handleUpdate = async () => {
    if (!providerId || !providerName || !providerUrl || !apiKey) {
      showMessage("error", "All fields required");
      return;
    }

    setLoading(true);

    const res = await updateProviderAction({
      id: Number(providerId),
      name: providerName,
      providerUrl,
      apiKey,
    });

    setLoading(false);

    if (!res.status) return showMessage("error", res.message);

    showMessage("success", "Provider updated successfully!");

    setShowEditPopup(false);
    resetForm();
    loadProviders();
  };

  /* ---------------------- DELETE PROVIDER ---------------------- */

  const handleDelete = async () => {
    setLoading(true);

    const res = await deleteProviderAction(deleteId);

    setLoading(false);

    if (!res.status) return showMessage("error", res.message);

    showMessage("success", "Provider deleted successfully!");

    setShowDeletePopup(false);
    loadProviders();
  };

  /* ---------------------- RESET FORM ---------------------- */

  const resetForm = () => {
    setProviderId("");
    setProviderName("");
    setProviderUrl("");
    setApiKey("");
    setEditData(null);
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <div className="p-6">

      {/* ----------- MESSAGE BANNER ----------- */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Provider Button */}
      <button
        onClick={() => setShowAddPopup(true)}
        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        <Plus size={18} />
        Add Provider
      </button>

      <h1 className="text-2xl font-semibold mb-6 mt-4">Providers List</h1>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-300 bg-white dark:bg-[#151517] dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Provider URL</th>
              <th className="p-3 font-semibold">API Key</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tableLoading ? (
              <tr>
                <td className="p-4 text-center" colSpan="5">
                  Loading Providers...
                </td>
              </tr>
            ) : providers.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan="5">
                  No providers found
                </td>
              </tr>
            ) : (
              providers.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.providerUrl}</td>
                  <td className="p-3">{item.apiKey}</td>

                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditPopup(item)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setShowDeletePopup(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD POPUP */}
      {showAddPopup && (
        <Popup
          title="Add New Provider"
          loading={loading}
          onCancel={() => {
            setShowAddPopup(false);
            resetForm();
          }}
          onSubmit={handleAdd}
          providerId={providerId}
          providerName={providerName}
          providerUrl={providerUrl}
          apiKey={apiKey}
          setProviderId={setProviderId}
          setProviderName={setProviderName}
          setProviderUrl={setProviderUrl}
          setApiKey={setApiKey}
        />
      )}

      {/* EDIT POPUP */}
      {showEditPopup && (
        <Popup
          title={`Edit Provider: ${editData?.name}`}
          loading={loading}
          onCancel={() => {
            setShowEditPopup(false);
            resetForm();
          }}
          onSubmit={handleUpdate}
          providerId={providerId}
          providerName={providerName}
          providerUrl={providerUrl}
          apiKey={apiKey}
          setProviderId={setProviderId}
          setProviderName={setProviderName}
          setProviderUrl={setProviderUrl}
          setApiKey={setApiKey}
        />
      )}

      {/* DELETE POPUP */}
      {showDeletePopup && (
        <DeletePopup
          deleteId={deleteId}
          onCancel={() => setShowDeletePopup(false)}
          onDelete={handleDelete}
        />
      )}

      {/* Fade Animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------
   REUSABLE POPUPS
------------------------------------------------------------ */

function Popup({
  title,
  onCancel,
  onSubmit,
  loading,
  providerId,
  providerName,
  providerUrl,
  apiKey,
  setProviderId,
  setProviderName,
  setProviderUrl,
  setApiKey,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1b1b1d] rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <div className="space-y-4">
          <Input label="Provider ID" value={providerId} setValue={setProviderId} type="number" />
          <Input label="Provider Name" value={providerName} setValue={setProviderName} />
          <Input label="Provider URL" value={providerUrl} setValue={setProviderUrl} />
          <Input label="API Key" value={apiKey} setValue={setApiKey} />

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeletePopup({ deleteId, onCancel, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1b1b1d] p-6 w-full max-w-sm rounded-xl shadow-xl border dark:border-gray-700 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete provider ID <b>{deleteId}</b>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, setValue }) {
  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
      />
    </div>
  );
}
