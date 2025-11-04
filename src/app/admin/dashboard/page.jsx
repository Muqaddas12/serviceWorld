'use client'
import { getAllUsers } from "@/lib/adminServices";
import { getServices } from "@/lib/services";
import { useEffect, useState } from "react";
export default function AdminDashboard() {
  const [totalUsers,setTotalUsers]=useState(0)
  const [totalOrders,setTotalOrders]=useState(0)
  const [totalServices,setTotalServices]=useState(0)
  useEffect(()=>{
    const fetchData=async () => {
      const users=await getAllUsers()
      const services=await getServices()

      console.log(services)
      if(users.success){
        setTotalUsers(users.count)
      }
      if(services){
        setTotalServices(services.length)
      }

      
    }
fetchData()
  },[])

  const stats = [
    { title: "Total Users", value: `${totalUsers}`, icon: "👥" },
    { title: "Total Orders", value: "82,045,541", icon: "🧾" },
    { title: "Active Services", value: `${totalServices}`, icon: "⚙️" },
    { title: "Pending Deposits", value: "₹18,450", icon: "💰" },
  ];

  const recentOrders = [
    { id: "ORD-1023", user: "john_doe", service: "Instagram Followers", amount: "₹250", status: "Completed" },
    { id: "ORD-1022", user: "alex99", service: "YouTube Views", amount: "₹500", status: "Pending" },
    { id: "ORD-1021", user: "techguru", service: "Telegram Members", amount: "₹750", status: "Completed" },
    { id: "ORD-1020", user: "rahul123", service: "Facebook Likes", amount: "₹350", status: "Failed" },
  ];

  const recentDeposits = [
    { id: "DEP-205", user: "john_doe", amount: "₹2,000", method: "BharatPe", status: "Approved" },
    { id: "DEP-204", user: "alex99", amount: "₹1,500", method: "Paytm", status: "Pending" },
    { id: "DEP-203", user: "maria07", amount: "₹3,200", method: "PhonePe", status: "Approved" },
  ];

  const topUsers = [
    { user: "john_doe", orders: 124, spent: "₹24,500" },
    { user: "alex99", orders: 98, spent: "₹18,000" },
    { user: "maria07", orders: 76, spent: "₹12,700" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-400 mb-1">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your SMM panel’s analytics and activity.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-5 flex flex-col items-center text-center shadow-md hover:shadow-yellow-500/10 transition"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Recent Orders</h2>
          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/30 active:scale-95 transition">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-yellow-500/20 text-yellow-400">
                <th className="py-2 px-3 text-left">Order ID</th>
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Service</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={i}
                  className="border-b border-yellow-500/10 hover:bg-[#1c1c1e] transition"
                >
                  <td className="py-2 px-3">{order.id}</td>
                  <td className="py-2 px-3">{order.user}</td>
                  <td className="py-2 px-3">{order.service}</td>
                  <td className="py-2 px-3 text-yellow-400 font-semibold">{order.amount}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-600/20 text-green-400"
                          : order.status === "Pending"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Recent Deposits</h2>
          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/30 active:scale-95 transition">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-yellow-500/20 text-yellow-400">
                <th className="py-2 px-3 text-left">Deposit ID</th>
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Method</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDeposits.map((dep, i) => (
                <tr
                  key={i}
                  className="border-b border-yellow-500/10 hover:bg-[#1c1c1e] transition"
                >
                  <td className="py-2 px-3">{dep.id}</td>
                  <td className="py-2 px-3">{dep.user}</td>
                  <td className="py-2 px-3 text-yellow-400 font-semibold">{dep.amount}</td>
                  <td className="py-2 px-3">{dep.method}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        dep.status === "Approved"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {dep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Top Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-yellow-500/20 text-yellow-400">
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Orders</th>
                <th className="py-2 px-3 text-left">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-yellow-500/10 hover:bg-[#1c1c1e] transition"
                >
                  <td className="py-2 px-3 font-semibold">{user.user}</td>
                  <td className="py-2 px-3">{user.orders}</td>
                  <td className="py-2 px-3 text-yellow-400 font-semibold">{user.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
