"use client";

import Image from "next/image";

export default function UserStatistics() {
  const stats = [
    { icon: "https://cdn.mypanel.link/hmz1fi/bcpg233dh40fsdoc.png", label: "Username", value: "58" },
    { icon: "https://cdn.mypanel.link/hmz1fi/raj356puppqixik9.png", label: "My Balance", value: "₹ 0" },
    { icon: "https://cdn.mypanel.link/hmz1fi/mp50mc1fhx7sm8o1.png", label: "Panel Orders", value: "6642" },
    { icon: "https://cdn.mypanel.link/hmz1fi/aw21tyz9g0kxlk1u.png", label: "Spent Balance", value: "₹ 0" },
  ];

  return (
    <div className="w-full bg-gray-200 py-5 flex px-4">
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl">
        {stats.map((stat, index) => (
          <div
  key={index}
  className="flex gap-3  items-center w-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl px-2 py-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
>
  <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">
    <Image
      src={stat.icon}
      alt={stat.label}
      width={50}
      height={50}
      className="object-contain"
    />
  </div>
  <div>
    <span className="block text-sm text-white/80">{stat.label}</span>
    <h4 className="text-2xl font-bold">{stat.value}</h4>
  </div>
</div>

        ))}
      </div>
    </div>
  );
}
