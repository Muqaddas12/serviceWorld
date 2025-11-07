"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Shield, Globe, CreditCard, UserCog, Lock } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const sections = [
    {
      title: "General",
      icon: <UserCog className="text-yellow-400" size={20} />,
      desc: "Basic preferences, profile, and admin information.",
      actions: [
        {
          name: "Profile Settings",
          onClick: () => router.push("/admin/settings/profile"),
        },
        {
          name: "Edit Website",
          onClick: () => router.push("/admin/settings/edit-website"),
        },
        {
          name: "Refferal",
          onClick: () => router.push("/admin/settings/affiliate"),
        },
      ],
    },
    {
      title: "Integrations",
      icon: <Globe className="text-yellow-400" size={20} />,
      desc: "Connect payment systems or APIs to your admin panel.",
      actions: [
        {
          name: "Manage Payment Methods",
          onClick: () => router.push("/admin/settings/payment-methods"),
        },
        {
          name: "Child Panel",
          onClick: () => router.push("/admin/settings/child-panel-requests"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="text-yellow-400" size={26} />
        <h1 className="text-2xl font-bold text-yellow-400">Settings</h1>
      </div>

      <p className="text-gray-400 mb-10 max-w-2xl">
        Configure your admin panel, update security policies, and connect integrations.
      </p>

      {/* Settings Sections */}
      <div className="space-y-8">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 shadow-lg"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-3">
              {section.icon}
              <h2 className="text-lg font-semibold text-yellow-400">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-400 mb-5 text-sm">{section.desc}</p>

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              {section.actions.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={action.onClick}
                  className="w-full text-left flex items-center justify-between gap-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20 text-yellow-300 font-medium py-3 px-5 rounded-xl border border-yellow-500/20 transition-all duration-300"
                >
                  {action.name}
                  <Lock size={16} className="opacity-50" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
