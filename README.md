





















// Server Component (default)
import { getServices } from "@/lib/services";
import ServicesList from "../components/ServicesList";
import { getWebsiteSettings } from "@/lib/adminServices";
import { FaTools } from "react-icons/fa";

export default async function ServicesPage() {
  const res = await getServices();
  const data = await getWebsiteSettings();
  const result=await JSON.parse(data.plainsettings)

  // 🟡 Handle error fetching services
  if (res.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <p className="text-red-400 text-lg font-medium mb-2">
          ⚠️ Failed to fetch services:
        </p>
        <p className="text-gray-400">{res.error}</p>
      </div>
    );
  }

  // 🔴 When services are turned OFF by admin
  if (!result.services) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-10 max-w-md shadow-[0_0_25px_rgba(234,179,8,0.08)]">
          <FaTools className="text-yellow-400 text-5xl mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-semibold text-yellow-400 mb-2">
            Services Temporarily Unavailable
          </h1>
          <p className="text-gray-300 leading-relaxed">
            Our service section is currently disabled by the administrator for
            maintenance or updates. <br /> Please check back later.
          </p>
          <p className="text-sm text-gray-500 mt-3 italic">
            We’ll be back soon — thank you for your patience!
          </p>
        </div>
      </div>
    );
  }

  // 🟢 Show services normally
  return <ServicesList services={res} />;
}







































{showServices && (
  <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
    <h2 className="text-lg font-semibold mb-3 text-center">Selected Services</h2>

    <table className="table-auto w-full border-collapse border border-gray-400 dark:border-gray-600 text-sm">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
      
          <th className="border p-2"></th>
          <th className="border p-2">ID</th>
          <th className="border p-2">Service Name</th>
          <th className="border p-2">Type</th>
          <th className="border p-2">Category</th>
          <th className="border p-2">Provider</th>
          <th className="border p-2">Rate + {profitPercentage + "%"}</th>
          <th className="border p-2">Min</th>
          <th className="border p-2">Max</th>
          <th className="border p-2">Description</th>
        </tr>
      </thead>

      <tbody>
        {reviewServices.map((s) => (
          <tr key={s.id}>
            {/* Checkbox */}
            <td className="border p-2 text-center">
              <input
                type="checkbox"
                checked={selectedServices.includes(s.id)}
                onChange={(e) => handleRowCheck(s.id, e.target.checked)}
              />
            </td>

            {/* ID */}
            <td className="border p-2 text-center">{s.id}</td>

            {/* Service Name */}
            <td className="border p-2">
              <input
                className=" border rounded p-1"
                value={s.name || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, name: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Type */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.type || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, type: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Category DROPDOWN */}
            <td className="border p-2">
              <select
                className="w-full border rounded-lg p-1"
                value={s.category || ""}  // ❗ null error fixed
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id
                        ? { ...row, category: e.target.value === "0" ? "Other" : e.target.value }
                        : row
                    )
                  )
                }
              >
                <option value="0">Create New</option>
                {categories.filter(c => c !== "All").map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </td>

            {/* Provider */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.provider || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, provider: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Rate (price + profitPercentage increase) */}
<td className="border p-2">
  <input
    className="w-full border rounded p-1"
    value={s.rate || ""}
    onChange={(e) =>
      setReviewServices(prev =>
        prev.map(row =>
          row.id === s.id ? { ...row, rate: e.target.value } : row
        )
      )
    }
  />

  {/* ✅ show increased price below input */}
  <div className="text-xs mt-1 text-gray-700 dark:text-gray-300 font-medium">
    Final Rate: {s.rate ? (Number(s.rate) + (Number(s.rate) * profitPercentage) / 100).toFixed(2) : "0.00"}
  </div>

</td>


            {/* Min */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.min || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, min: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Max */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.max || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, max: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Description */}
            <td className="border p-2">
              <textarea
                className="w-full border rounded p-1"
                value={s.description || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, description: e.target.value } : row
                    )
                  )
                }
              />
            </td>

         
          </tr>
        ))}
      </tbody>
    </table>

    {/* FINAL SUBMIT BUTTON */}
    <button
      onClick={handleFinalSubmit}
      disabled={submitting}
      className="mt-6 px-6 py-3 bg-blue-600 text-white text-md rounded-xl shadow hover:opacity-90 disabled:opacity-50"
    >
      {submitting ? "Submitting…" : "Import services"}
    </button>
  </div>
)}














✅ Order created successfully (ID: 6937)
