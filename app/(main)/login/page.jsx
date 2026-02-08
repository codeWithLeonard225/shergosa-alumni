"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  FaUserCircle,
  FaIdCard,
  FaUser,
  FaSpinner,
  FaShieldAlt,
  FaBuilding,
} from "react-icons/fa";

/* 🔀 Dynamic Route Resolver */
const getRouteByType = (role, dashboardType) => {
  if (role === "admin") {
    switch (dashboardType) {
      case "AdminDashboard1":
        return "/admindashboard/admin/dashboard1";
      case "AdminDashboard2":
      return "/admindashboard/admin/dashboard2";
      default:
        // return "/dashboard/admin";
        return <div> PAge Not Found</div>
    }
  }

  if (role === "client") {
    switch (dashboardType) {
      case "StudentDashboard":
        return "/dashboard/student";
      case "ClientDashboard":
        return "/dashboard/clientdashboard";
      default:
        return "/dashboard/clientdashboard";
    }
  }

  return "/";
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clientId = e.target.clientId.value.trim();
    const fullName = e.target.fullName.value.trim();


    try {
      /* ================= ADMIN LOGIN ================= */
      const adminQuery = query(
        collection(db, "admins"),
        where("adminId", "==", clientId),
        where("fullname", "==", fullName),
    
      );

      const adminSnap = await getDocs(adminQuery);

      if (!adminSnap.empty) {
        const adminData = adminSnap.docs[0].data();

        localStorage.setItem(
          "hloUser",
          JSON.stringify({ ...adminData, role: "admin" })
        );

        router.push(
          getRouteByType("admin", adminData.dashboardType)
        );
        return;
      }

      /* ================= CLIENT / STUDENT LOGIN ================= */
      const clientQuery = query(
        collection(db, "clients"),
        where("clientId", "==", clientId),
        where("fullname", "==", fullName),
      
      );

      const clientSnap = await getDocs(clientQuery);

      if (!clientSnap.empty) {
        const clientData = clientSnap.docs[0].data();

        localStorage.setItem(
          "hloUser",
          JSON.stringify({ ...clientData, role: "client" })
        );

        router.push(
          getRouteByType("client", clientData.dashboardType)
        );
      } else {
        setError(
          "Invalid ID, Name, or Organisation. Ensure details match exactly."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Network or system error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border-t-8 border-indigo-700">
        <div className="p-8 text-center">
          <FaUserCircle className="text-6xl text-indigo-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">SHERGOSA</h1>
          <p className="text-gray-500">
            SOS Hermann Gmeiner Old Students' Association
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 pt-0 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* ORGANISATION ID */}
          {/* <div>
            <label className="block text-sm font-semibold mb-2">
              Organisation / Association ID
            </label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-3 text-gray-400" />
              <input
                name="orgId"
                placeholder="e.g. SHERGOSA"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div> */}

          {/* USER ID */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              ID Number
            </label>
            <div className="relative">
              <FaIdCard className="absolute left-3 top-3 text-gray-400" />
              <input
                name="clientId"
                placeholder="ADM-001 / HLO-12345"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Registered Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="fullName"
                placeholder="Full Name"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl flex justify-center items-center"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
          </button>
        </form>

        <div className="p-6 bg-gray-50 text-center border-t">
          <p className="text-xs text-gray-400 flex justify-center items-center gap-1">
            <FaShieldAlt /> Secure Multi-Organisation Access
          </p>
          <p className="text-sm">
            Not registered?
            <Link
              href="/register"
              className="text-green-600 font-bold ml-1 hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
