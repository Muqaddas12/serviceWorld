"use client";

export default function CategorySection({ category }) {
  return (
    <tr className="bg-gray-200 dark:bg-[#1E1F23] dark:text-gray-200">
      <td colSpan="7" className="px-4 py-3 font-bold text-lg">
        {category}
      </td>
    </tr>
  );
}
