"use client";
import { FaMoneyBillWave, FaLock, FaUserSecret, FaBolt } from "react-icons/fa";

export default function WhyChooseUs() {
  const items = [
    {
      title: "Affordable Reseller Panel",
      icon: <FaMoneyBillWave className="text-[#4A6CF7] text-4xl" />,
      desc: "We provide the most affordable SMM panel at unbeatable prices, suitable for every business regardless of size.",
    },
    {
      title: "Secure Transactions & Reliable Services",
      icon: <FaLock className="text-[#4A6CF7] text-4xl" />,
      desc: "All transactions are encrypted and secure. Focus on growing your social presence with peace of mind.",
    },
    {
      title: "Complete Privacy",
      icon: <FaUserSecret className="text-[#4A6CF7] text-4xl" />,
      desc: "We ensure your privacy and confidentiality while you use our top-tier SMM services.",
    },
    {
      title: "Instant Activation, No Hassle",
      icon: <FaBolt className="text-[#4A6CF7] text-4xl" />,
      desc: "Enjoy instant activation—no delays, no waiting. Start boosting your presence immediately.",
    },
  ];

  return (
    <section
      id="why-choose"
      className="px-6 md:px-12 bg-[#F5F7FA] dark:bg-[#0F1117] py-16 transition-colors"
    >
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4A6CF7]">
          Why Choose Us
        </h2>

        <p className="text-[#4A5568] dark:text-[#A0AEC3] mt-3 text-lg">
          We make your growth faster, smarter, and effortless.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="
              bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 shadow-lg 
              text-center border border-[#4A6CF7]/20 flex flex-col items-center
              transition-colors
            "
          >
            {/* Icon */}
            <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center border border-[#4A6CF7]/30">
              {item.icon}
            </div>

            <h3 className="text-lg font-semibold text-[#4A6CF7] mb-2">
              {item.title}
            </h3>

            <p className="text-[#4A5568] dark:text-[#A0AEC3] text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
