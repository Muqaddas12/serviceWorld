"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  UserCog,
  Globe,
  Lock,
  PlugZap,
  Wallet,
  FileText,
  Share2,
} from "lucide-react";

import AddProvider from "./AddProvider";
import SmtpConfigPage from "./Smtp";
import GoogleConfigPage from "./GoogleConfigPage";

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("General");

  const sections = [
    {
      title: "General",
      icon: <UserCog className="text-gray-700 dark:text-gray-200" size={20} />,
      desc: "Manage your basic admin preferences and profile information.",
      actions: [
        {
          name: "Profile Settings",
          icon: <UserCog size={18} />,
          link: "/admin/settings/profile",
        },
        {
          name: "Edit Website",
          icon: <Globe size={18} />,
          link: "/admin/settings/edit-website",
        },
        {
          name: "Referral",
          icon: <PlugZap size={18} />,
          link: "/admin/settings/affiliate",
        },

        // ✅ New options
        {
          name: "Manage Blog",
          icon: <FileText size={18} />,
          link: "/admin/settings/blog-write",
        },
        {
          name: "Social Media Links",
          icon: <Share2 size={18} />,
          link: "/admin/settings/socialmedia",
        },
      ],
    },
    {
      title: "Integrations",
      icon: <Globe className="text-gray-700 dark:text-gray-200" size={20} />,
      desc: "Connect payment systems and external APIs.",
      actions: [
        {
          name: "Manage Payment Methods",
          icon: <Wallet size={18} />,
          link: "/admin/settings/payment-methods",
        },
        {
          name: "Child Panel",
          icon: <Lock size={18} />,
          link: "/admin/settings/child-panel-requests",
        },
      ],
    },

    // 🔥 Add Provider Section
    {
      title: "Add Provider",
      icon: <PlugZap className="text-gray-700 dark:text-gray-200" size={20} />,
      desc: "Add or manage your service providers.",
      actions: [], // No cards needed (we show AddProvider instead)
    },
    {
      title: "Smtp Config",
      icon: <PlugZap className="text-gray-700 dark:text-gray-200" size={20} />,
      desc: " Add or manage your email service configuration.",
      actions: [], // No cards needed (we show AddProvider instead)
    },
    {
      title: "Google Auth",
      icon: <PlugZap className="text-gray-700 dark:text-gray-200" size={20} />,
      desc: " Add or manage your Google Auth  configuration.",
      actions: [], // No cards needed (we show AddProvider instead)
    },
  ];

  const activeData = sections.find((s) => s.title === activeSection)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0d0d0d] text-gray-800 dark:text-gray-200 flex flex-col md:flex-row transition-colors">
      {/* Sidebar */}
      <div className="md:w-64 w-full md:min-h-screen border-r border-gray-300 dark:border-gray-800 bg-white dark:bg-[#151517] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-gray-900 dark:text-gray-200" size={22} />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          {sections.map((section, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveSection(section.title)}
              whileHover={{ scale: 1.02, x: 3 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm border transition-all
                ${
                  activeSection === section.title
                    ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }
              `}
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
              <h2 className="text-2xl font-semibold">{activeData.title}</h2>
            </div>

            <p className="text-gray-700 dark:text-gray-400 mb-8">
              {activeData.desc}
            </p>

            {/* 🔥 Show Cards OR AddProvider Component */}
            {activeSection === "Add Provider" ? (
              <AddProvider />
            ): activeSection === "Smtp Config" ? (
              <SmtpConfigPage/>
            ) : activeSection === "Google Auth" ? (
          <GoogleConfigPage/>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {activeData.actions.map((action, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(action.link)}
                    className="bg-white dark:bg-[#151517] border border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 
                    p-5 rounded-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4">
                      {action.icon}
                    </div>
                    <h3 className="font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition">
                      {action.name}
                    </h3>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
