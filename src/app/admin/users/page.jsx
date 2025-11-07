"use server";

import { getAllUsers, getDeletedUsers } from "@/lib/adminServices";
import AllUsers from "./AllUsers";

export default async function UserPage() {
  try {
    // 🧠 Fetch active + deleted users
    const users = await getAllUsers();
    const dusers = await getDeletedUsers();

    const activeUsers = users?.users || [];
    const deletedUsers = dusers?.users || [];

    return <AllUsers users={activeUsers} dusers={deletedUsers} />;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0f] text-red-400 text-lg">
        Failed to load users.
      </div>
    );
  }
}
