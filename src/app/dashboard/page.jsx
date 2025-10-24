"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ServicesPage from "../components/ServicesList";
import TicketSupport from "../components/TicketSupport";
import UserStatistics from "../components/UserStatistics";
import CategoryFilter from "../components/CategoryFilter";
import JoinButtons from "../components/JoinButton";
import NewOrderForm from "../components/NewOrderForm";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("New Order");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data?.user) setUser(res.data.user);
        else throw new Error("Unauthorized");
      } catch (err) {
        setError(err.response?.data?.error || "Access Denied");
        setTimeout(() => router.replace("/auth/login"), 2000);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (selectedMenu === "Services") {
      const fetchServices = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/services/getservices");
          if (!res.ok) throw new Error("Failed to fetch services");
          const data = await res.json();
          setServices(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchServices();
    }
  }, [selectedMenu]);
  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/login");
  };

  // Error Page
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-r from-red-400 to-red-600">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-700 mt-2">{error}</p>
          <a
            href="/auth/login"
            className="text-blue-600 underline mt-4 inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Loading
  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
  <div className="flex space-x-2">
    <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
    <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
  </div>
  <p className="mt-4 text-white text-lg font-semibold">Loading Dashboard...</p>
</div>

    );

  // Render main content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "Services":
        if (loading)
                  return (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-blue-300 animate-pulse">Loading services...</p>
                    </div>
                  );
                if (error)
                  return (
                    <div className="text-red-400 text-center mt-8">
                      <p>⚠️ {error}</p>
                    </div>
                  );
                return <ServicesPage services={services} />;
      case "Tickets Support":
        return <TicketSupport />;
      case "New Order":
        return(
          <>
            <UserStatistics />
      <CategoryFilter />
      <JoinButtons />
      <NewOrderForm/>
          </>
        )
      case "Orders History":
      case "Add Funds":
      default:
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-300">
              Welcome {user.username}
            </h1>
            <p className="text-gray-300">
              Select an option from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200 text-white overflow-hidden">
      {/* Header */}
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Dashboard Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          user={user}
          onLogout={handleLogout}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 bg-gray-200 text-black overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
