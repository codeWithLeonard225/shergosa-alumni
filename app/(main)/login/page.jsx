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
  FaScroll,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

/* 🔀 Updated Dynamic Route Resolver */
const getRouteByType = (role, userData) => {
  if (role === "admin") {
    switch (userData.dashboardType) {
      case "AdminDashboard1":
        return "/admindashboard/admin/dashboard1";
      case "AdminDashboard2":
        return "/admindashboard/admin/dashboard2";
      default:
        return "/admindashboard/admin/dashboard1";
    }
  }

  if (role === "client") {
    if (userData.orgId === "SHERGOSA") {
      return "/StudentDashboard/SHERGOSA";
    }
    if (userData.orgId === "RURAL_SCHOOL") {
      return "/dashboard/student";
    }
    if (userData.orgId === "LIL_OTHERS") {
      return "/dashboard/finance";
    }
    return "/dashboard/clientdashboard";
  }

  return "/";
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(true); // Pop-up enabled by default
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clientId = e.target.clientId.value.trim().toUpperCase();
    const fullName = e.target.fullName.value.trim().toUpperCase();

    try {
      /* ================= ADMIN LOGIN ================= */
      const adminQuery = query(
        collection(db, "admins"),
        where("adminId", "==", clientId),
        where("fullname", "==", fullName)
      );

      const adminSnap = await getDocs(adminQuery);

      if (!adminSnap.empty) {
        const adminData = adminSnap.docs[0].data();

        localStorage.setItem(
          "hloUser",
          JSON.stringify({ ...adminData, role: "admin" })
        );

        router.push(getRouteByType("admin", adminData));
        return;
      }

      /* ================= CLIENT / STUDENT LOGIN ================= */
      const clientQuery = query(
        collection(db, "clients"),
        where("clientId", "==", clientId),
        where("fullname", "==", fullName)
      );

      const clientSnap = await getDocs(clientQuery);

      if (!clientSnap.empty) {
        const clientData = clientSnap.docs[0].data();

        localStorage.setItem(
          "hloUser",
          JSON.stringify({ ...clientData, role: "client" })
        );

        router.push(getRouteByType("client", clientData));
      } else {
        setError("Invalid ID or Name. Ensure details match exactly.");
      }
    } catch (err) {
      console.error(err);
      setError("Network or system error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 relative">
      {/* 팝업 모달 (Popup Modal) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border-t-8 border-indigo-700 flex flex-col max-h-[90vh]">
            {/* 팝업 헤더 */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30 rounded-t-2xl">
              <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                <FaScroll className="text-indigo-600" /> Welcome to SHERGOSA Alumni
              </h2>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* 팝업 본문 (규정 내용) */}
            <div className="p-6 space-y-5 text-sm text-gray-600 overflow-y-auto flex-1 leading-relaxed">
              <div>
                <p className="font-semibold text-gray-800 text-base mb-2">
                  We warmly welcome you to the Official SHERGOSA Alumni WhatsApp Group. We are delighted to have you as part of our alumni family.
                </p>
                <p>
                  To ensure that our group remains respectful, peaceful, and beneficial to everyone, all members are expected to observe the following rules and regulations. By joining this group, you agree to abide by these guidelines.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-indigo-900 border-b pb-1 text-base">Group Rules & Regulations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Respect is mandatory.</strong> Any form of abusive, insulting, or offensive language will not be tolerated.</li>
                  <li>Sharing nudity or inappropriate content is strictly prohibited.</li>
                  <li>Members are encouraged to share useful, educational, and beneficial information with the group.</li>
                  <li>If you would like your birthday to be celebrated in the group, kindly notify the admin team in advance.</li>
                  <li><strong>Group tagging on WhatsApp Status is not allowed.</strong> Any member who tags the group on their personal WhatsApp Status will be removed immediately.</li>
                  <li>Whenever you want to contribute to the discussion, <strong>kindly introduce yourself</strong> by stating your name and your graduation year before your message.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-indigo-900 border-b pb-1 text-base">📅 Weekly Faith Sharing</h3>
                <p><strong>Fridays:</strong> Our Muslim members may share Islamic teachings, reminders, and reflections.</p>
                <p><strong>Saturdays & Sundays:</strong> Our Christian members may share messages of faith, encouragement, and inspiration.</p>
              </div>

              <div className="space-y-2 bg-red-50/50 p-4 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-900 text-base">⚠️ Disciplinary Measures</h3>
                <p>Every member must treat others with courtesy and respect. Any act of disrespect may result in:</p>
                <ul className="list-disc pl-5 space-y-1 text-red-800 font-medium">
                  <li>A fine of Le 1,000, where applicable;</li>
                  <li>Removal from the WhatsApp group; or</li>
                  <li>Suspension from the WhatsApp group and other SHERGOSA alumni activities for six (6) months, depending on the severity of the misconduct.</li>
                </ul>
                <p className="text-xs text-red-600 mt-2 font-semibold">
                  Members who are unwilling to comply with these rules are free to leave the group voluntarily.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-indigo-900 text-base">Need Help?</h3>
                <p>If you have any questions or need clarification regarding these rules, please contact any member of the admin team.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100 text-xs italic">
                <span className="font-bold block text-gray-700 mb-1">Declaration</span>
                By clicking Register or joining the SHERGOSA Alumni WhatsApp Group, you confirm that you have read, understood, and agreed to abide by these rules and regulations.
              </div>
            </div>

            {/* 팝업 푸터 (닫기/동의 버튼) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <FaCheckCircle /> I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 기본 로그인 화면 */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border-t-8 border-indigo-700">
        <div className="p-8 text-center border-b border-gray-100">
          <FaUserCircle className="text-6xl text-indigo-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tighter">SHERGOSA</h1>
          <p className="text-gray-500 text-sm mt-1">
            SOS Hermann Gmeiner Old Students' Association
          </p>
          
          {/* 팝업 다시 열기 버튼 (필요시 사용) */}
          <button 
            onClick={() => setShowPopup(true)}
            className="mt-4 text-xs font-bold text-indigo-600 hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <FaScroll /> View Rules & Regulations
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* USER ID */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 ml-1">
              Membership ID Number
            </label>
            <div className="relative">
              <FaIdCard className="absolute left-3 top-4 text-gray-400 text-lg" />
              <input
                name="clientId"
                placeholder="e.g. SHG-2026"
                className="pl-10 w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                required
              />
            </div>
          </div>

          {/* FULL NAME */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2 ml-1">
              Full Registered Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
              <input
                name="fullName"
                placeholder="Full Name"
                className="pl-10 w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-black uppercase tracking-widest py-4 rounded-xl flex justify-center items-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In to Portal"}
          </button>
        </form>

        <div className="p-6 bg-gray-50 text-center border-t rounded-b-2xl">
          <p className="text-[10px] text-gray-400 flex justify-center items-center gap-1 mb-2 uppercase font-bold">
            <FaShieldAlt /> Secure Alumni Access
          </p>
          <p className="text-sm text-gray-600">
            Not registered yet? 
            <Link
              href="/register"
              className="text-indigo-600 font-black ml-1 hover:underline"
            >
              Join Association
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}