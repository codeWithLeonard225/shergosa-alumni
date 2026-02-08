"use client";
import React, { useState, useEffect } from "react";
import { MdDashboard, MdPayments, MdLightbulb, MdCreditCard, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import ClientContributionHistory from "../clientContributionHistory/ClientContributionHistory";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("hloUser");
    if (savedUser) {
      setClientData(JSON.parse(savedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  // ⭐ IMPROVEMENT: Helper to handle tab switching AND closing the menu
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("hloUser");
    router.push("/login");
  };

  if (!clientData) return <div className="h-screen flex items-center justify-center font-bold text-indigo-900">Authenticating...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-900">Welcome back, {clientData.fullname}!</h2>
            <p className="text-gray-500 mt-2">Member ID: <span className="font-mono font-bold text-indigo-600">{clientData.clientId}</span></p>
          </div>
        );
      case "contributions":
        return <ClientContributionHistory clientId={clientData.clientId} />;
      default:
        return <div className="p-4 uppercase font-bold text-gray-400">Section coming soon...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      
      {/* ⭐ 1. MOBILE OVERLAY (Backdrop) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white p-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* ⭐ 2. MOBILE CLOSE BUTTON */}
        <div className="flex items-center justify-between mb-8 border-b border-indigo-800 pb-4">
          <div className="font-black text-xl tracking-widest">HLF PORTAL</div>
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(false)}>
            <MdClose />
          </button>
        </div>
        
        <nav className="space-y-2">
          <NavBtn icon={<MdDashboard/>} label="Dashboard" active={activeTab === "dashboard"} onClick={() => switchTab("dashboard")} />
          <NavBtn icon={<MdPayments/>} label="Contributions" active={activeTab === "contributions"} onClick={() => switchTab("contributions")} />
          <NavBtn icon={<MdLightbulb/>} label="Ideas" active={activeTab === "idea"} onClick={() => switchTab("idea")} />
          <NavBtn icon={<MdCreditCard/>} label="Digital ID" active={activeTab === "id-card"} onClick={() => switchTab("id-card")} />
        </nav>

        <button className="mt-auto flex items-center gap-2 text-red-300 hover:text-white pt-10 font-bold" onClick={handleLogout}>
          <MdLogout /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between shadow-sm">
          {/* ⭐ 3. TOGGLE BUTTON */}
          <button className="md:hidden text-2xl text-indigo-900" onClick={() => setSidebarOpen(true)}>
            <MdMenu />
          </button>
          
          <h1 className="font-bold text-gray-700 capitalize tracking-tight">{activeTab}</h1>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
               <p className="text-xs font-bold text-gray-800">{clientData.fullname}</p>
               <p className="text-[10px] text-gray-400 font-mono">{clientData.clientId}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-black border-2 border-indigo-100">
              {getInitials(clientData.fullname)}
            </div>
          </div>
        </header>

        <section className="p-6 overflow-y-auto h-full">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active ? "bg-white text-indigo-900 shadow-lg scale-105" : "text-indigo-100 hover:bg-white/10"}`}>
      {icon} {label}
    </button>
  );
}