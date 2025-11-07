"use client"

import { useState, useEffect } from "react"
import { getAffiliateSettings,updateAffiliateSettings } from "@/lib/adminServices"

export default function AffiliateSettingsAdmin() {
  const [commission, setCommission] = useState(5)
  const [payout, setPayout] = useState(50)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadSettings() {
      const data = await getAffiliateSettings()
      setCommission(data.commission_rate)
      setPayout(data.minimum_payout)
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const result = await updateAffiliateSettings({
      commission_rate: commission,
      minimum_payout: payout,
    })
    setSaving(false)
    setMessage(result.success ? "✅ Settings updated!" : "❌ Failed to update.")
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Affiliate Settings (Admin)
      </h1>

      <div className="bg-[#151517] p-6 rounded-2xl border border-yellow-500/20 shadow-lg max-w-md">
        <label className="block mb-4">
          <span className="text-gray-300">Commission Rate (%)</span>
          <input
            type="number"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg p-3 text-gray-300 mt-1"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-300">Minimum Payout ($)</span>
          <input
            type="number"
            value={payout}
            onChange={(e) => setPayout(e.target.value)}
            className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg p-3 text-gray-300 mt-1"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {message && <p className="text-center mt-3 text-yellow-400">{message}</p>}
      </div>
    </div>
  )
}
