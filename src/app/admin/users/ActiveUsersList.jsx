"use client";
import { Users } from "lucide-react";
import { useState, useMemo } from "react";
import UserCard from "./UserCard";

export default function ActiveUsersList({ users = [],totalBalance=0 }) {
  const [sortByBal, setSortByBal] = useState(false);

  const displayedUsers = useMemo(() => {
    if (!sortByBal) return users;

    return [...users].sort((a, b) => {
      const balA = parseFloat(
        String(a?.balance ?? "0").replace(/[^\d.-]/g, "")
      ) || 0;

      const balB = parseFloat(
        String(b?.balance ?? "0").replace(/[^\d.-]/g, "")
      ) || 0;

      // 🔥 HIGH → LOW
      return balB - balA;
    });
  }, [users, sortByBal]);

  return (
    <section className="mb-12 relative z-10">
<div className="flex justify-end">
  <h3 className="text-right">
   Total Balance- ₹ {Number(totalBalance || 0).toFixed(2)}
  </h3>
</div>


      <div className="flex items-center justify-between mb-4">
       
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users size={18} />
          Active Users ({users.length})
        </h2>

        <button
          onClick={() => setSortByBal((p) => !p)}
          className="px-4 py-1.5 rounded-md text-sm bg-gray-200 dark:bg-gray-700"
        >
          {sortByBal ? "Normal Order" : "Sort by Balance (High → Low)"}
        </button>
      </div>

      {users.length === 0 ? (
        <p>No active users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {displayedUsers.map((u) => (
            <UserCard key={u._id} user={u} type="active" />
          ))}
        </div>
      )}
    </section>
  );
}
