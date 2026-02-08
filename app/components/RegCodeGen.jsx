"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { 
  collection, addDoc, getDocs, query, 
  orderBy, serverTimestamp, deleteDoc, doc, where 
} from "firebase/firestore";
import { 
  MdVpnKey, MdRefresh, MdDelete, 
  MdContentCopy, MdCheckCircle, MdPersonAdd 
} from "react-icons/md";

// 1. Move ORG_ID here so all functions can see it
const ORG_ID = "SHERGOSA";

export default function RegCodeGen() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState(""); 
  const [copying, setCopying] = useState(null);

  // 2. Updated fetchCodes to use the shared ORG_ID
  const fetchCodes = async () => {
    try {
      const q = query(
        collection(db, "reg_codes"), 
        where("orgId", "==", ORG_ID),
      
      );
      const snap = await getDocs(q);
      setCodes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const generateNewCode = async (e) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert("Please enter a name for the recipient.");
      return;
    }

    setLoading(true);
    const newCode = "SOS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await addDoc(collection(db, "reg_codes"), {
        orgId: ORG_ID, // Uses the top-level constant   
        code: newCode,
        assignedTo: recipientName,
        status: "active",
        createdAt: serverTimestamp(),
      });
      
      setRecipientName(""); 
      fetchCodes(); 
    } catch (err) {
      console.error("Error generating code:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCode = async (id, itemOrgId) => {
    // Safety check
    if (itemOrgId !== ORG_ID) {
      alert("Unauthorized action");
      return;
    }

    if (confirm("Delete this code?")) {
      try {
        await deleteDoc(doc(db, "reg_codes", id));
        fetchCodes();
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ⭐ TOP SECTION: GENERATOR FORM */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/10 rounded-2xl">
            <MdVpnKey className="text-yellow-400 text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Code Generator</h2>
            <p className="text-indigo-200 text-sm">Create a secure registration key for a specific member.</p>
          </div>
        </div>

        <form onSubmit={generateNewCode} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdPersonAdd className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
            <input 
              type="text"
              placeholder="Enter Recipient Name (e.g. Musa Kamara)"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-indigo-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <MdRefresh className="animate-spin text-2xl" /> : "Generate Key"}
          </button>
        </form>
      </div>

      {/* ⭐ BOTTOM SECTION: TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50">
          <h3 className="font-black text-gray-700 uppercase tracking-tighter">Issued Registration Keys</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Recipient Name</th>
                <th className="px-6 py-4">Access Code</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 capitalize">
                    {item.assignedTo || "Unnamed"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-indigo-600">
                      {item.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.status === 'active' ? 'AVAILABLE' : 'USED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => copyToClipboard(item.code, item.id)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-indigo-600 hover:text-white transition shadow-sm"
                        title="Copy Code"
                      >
                        {copying === item.id ? <MdCheckCircle /> : <MdContentCopy />}
                      </button>
                      <button 
                        onClick={() => deleteCode(item.id, item.orgId)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {codes.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">
            No codes have been generated yet.
          </div>
        )}
      </div>
    </div>
  );
}