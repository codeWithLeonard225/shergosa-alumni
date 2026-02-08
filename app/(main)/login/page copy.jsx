"use client";
//app/(main)/login/page
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUserCircle, FaIdCard, FaUser, FaSpinner, FaShieldAlt } from "react-icons/fa";

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
      // 1. Check Admin Collection
      const adminQuery = query(
        collection(db, "admins"), 
        where("adminId", "==", clientId),
        where("fullname", "==", fullName)
      );
      const adminSnap = await getDocs(adminQuery);

      if (!adminSnap.empty) {
        const adminData = adminSnap.docs[0].data();
        localStorage.setItem("hloUser", JSON.stringify({ ...adminData, role: 'admin' }));
        router.push("/admindashboard");
        return;
      }

      // 2. Check Client Collection
      const clientQuery = query(
        collection(db, "clients"),
        where("clientId", "==", clientId),
        where("fullname", "==", fullName)
      );
      const clientSnap = await getDocs(clientQuery);

      if (!clientSnap.empty) {
        // ⭐ GET DATA FROM FIRESTORE
        const clientData = clientSnap.docs[0].data();

        // ⭐ SAVE TO LOCAL STORAGE
        localStorage.setItem("hloUser", JSON.stringify({ ...clientData, role: 'client' }));

        // REDIRECT
        router.push("/dashboard/clientdashboard");
      } else {
        // 🔥 Troubleshooting Tip: Check case sensitivity (John vs john)
        setError("Invalid ID or Name. Please ensure the name matches your ID Card exactly.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-indigo-700">
        
        <div className="p-8 text-center">
          <FaUserCircle className="text-6xl text-indigo-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">System Login</h1>
          <p className="text-gray-500">Access your SHERGOSA account</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 pt-0 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ID Number (Client or Admin)
            </label>
            <div className="relative">
              <FaIdCard className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="clientId"
                placeholder="HLO-XXXXX"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Registered Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition flex justify-center items-center shadow-lg"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
          </button>
        </form>

        <div className="p-6 bg-gray-50 text-center border-t flex flex-col gap-2">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <FaShieldAlt /> Secure Access Point
          </p>
          <p className="text-gray-600 text-sm">
            Not registered?
            <Link href="/register" className="text-green-600 font-bold hover:underline ml-1">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}