"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, UserCog, Globe, Lock, PlugZap, Wallet } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("General");

  const sections = [
    {
      title: "General",
      icon: <UserCog className="text-yellow-400" size={20} />,
      desc: "Manage your basic admin preferences and profile information.",
      actions: [
        { name: "Profile Settings", icon: <UserCog size={18} />, link: "/admin/settings/profile" },
        { name: "Edit Website", icon: <Globe size={18} />, link: "/admin/settings/edit-website" },
        { name: "Refferal", icon: <PlugZap size={18} />, link: "/admin/settings/affiliate" },
      ],
    },
    {
      title: "Integrations",
      icon: <Globe className="text-yellow-400" size={20} />,
      desc: "Connect payment systems and external APIs.",
      actions: [
        { name: "Manage Payment Methods", icon: <Wallet size={18} />, link: "/admin/settings/payment-methods" },
        { name: "Child Panel", icon: <Lock size={18} />, link: "/admin/settings/child-panel-requests" },
      ],
    },
  ];

  const activeData = sections.find((s) => s.title === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0c] to-[#111112] text-gray-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 w-full md:min-h-screen border-r border-yellow-500/20 bg-white/5 backdrop-blur-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-yellow-400" size={22} />
          <h1 className="text-xl font-semibold text-yellow-400">Settings</h1>
        </div>

        <div className="space-y-2">
          {sections.map((section, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveSection(section.title)}
              whileHover={{ scale: 1.02, x: 3 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all 
              ${
                activeSection === section.title
                  ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300"
                  : "hover:bg-yellow-500/10 text-gray-300 border border-transparent"
              }`}
            >
              {section.icon}
              {section.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              {activeData.icon}
              <h2 className="text-2xl font-semibold text-yellow-400">{activeData.title}</h2>
            </div>
            <p className="text-gray-400 mb-8">{activeData.desc}</p>

            {/* Actions as Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {activeData.actions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(action.link)}
                  className="bg-white/5 border border-yellow-500/20 hover:border-yellow-400/40 
                             hover:bg-yellow-500/10 p-5 rounded-2xl transition-all duration-300 
                             backdrop-blur-sm cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-500/10 mb-4 group-hover:bg-yellow-500/20 transition">
                    {action.icon}
                  </div>
                  <h3 className="text-yellow-300 font-medium text-base group-hover:text-yellow-200 transition">
                    {action.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
