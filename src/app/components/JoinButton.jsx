"use client";

import Image from "next/image";

export default function JoinButtons() {
  const buttons = [
    {
      href: "https://t.me/instantsmmboost",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
      label: "Telegram",
      color: "bg-sky-600 hover:bg-sky-700",
    },
    {
      href: "https://whatsapp.com/channel/0029Vb5qAIXL7UVdD5Fyoi2F",
      img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
      label: "WhatsApp",
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-200 rounded-2xl shadow-lg">
      {buttons.map((btn, index) => (
        <a
          key={index}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 ${btn.color} hover:scale-105`}
        >
          <Image
            src={btn.img}
            alt={btn.label}
            width={28}
            height={28}
            className="rounded-full bg-white p-1"
          />
          <span>Join {btn.label}</span>
        </a>
      ))}
    </div>
  );
}
