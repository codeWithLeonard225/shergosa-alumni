"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { 
  collection, addDoc, serverTimestamp, 
  query, where, getDocs 
} from "firebase/firestore";
import imageCompression from 'browser-image-compression';
import { MdErrorOutline, MdInfoOutline, MdFingerprint } from "react-icons/md"; 
import { uploadToCloudinary } from "@/app/lib/cloudinaryUpload";
import IDCardModal from "../../components/IDCardModal";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredClient, setRegisteredClient] = useState(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 600, useWebWorker: true };

    try {
      setLoading(true);
      const compressedFile = await imageCompression(file, options);
      setPhoto(compressedFile);
      setPhotoPreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      setError("Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target;
    const manualClientId = form.manualClientId.value.trim().toUpperCase();
    const inputRegCode = form.regCode.value.trim();

    try {
      // 1. Verify Registration Code
      const codeQuery = query(collection(db, "reg_codes"), where("code", "==", inputRegCode));
      const codeSnap = await getDocs(codeQuery);

      if (codeSnap.empty) {
        setError("Invalid Registration Code.");
        setLoading(false);
        return;
      }

      // 2. Check if the MANUALLY entered Client ID already exists
      const idDuplicateQuery = query(collection(db, "clients"), where("clientId", "==", manualClientId));
      const idDuplicateSnap = await getDocs(idDuplicateQuery);

      if (!idDuplicateSnap.empty) {
        setError("This Client ID is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      const photoURL = await uploadToCloudinary(photo);

      const clientData = {
        clientId: manualClientId, // Captured from manual input
        fullname: form.fullname.value,
        orgId: "SHERGOSA", // Default value added
        role: "client",    // Default value added
        pob: form.pob.value, 
        dob: form.dob.value,
        gender: form.gender.value,
        nationality: form.nationality.value, 
        occupation: form.occupation.value,
        tel: form.tel.value,
        email: form.email.value, 
        address: form.address.value,
        eduPeriod: form.eduPeriod.value, 
        className: form.className.value, 
        membershipTier: form.membershipTier.value, 
        regCode: inputRegCode,
        photoURL,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "clients"), clientData);
      setRegisteredClient(clientData);
      form.reset();
      setPhotoPreview(null);

    } catch (err) {
      setError("Technical issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 flex justify-center px-6 py-10">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-blue-600">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">SHERGOSA Membership</h1>
            <p className="text-gray-500 font-medium">SOS Hermann Gmeiner Old Students' Association</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* PHOTO UPLOAD */}
            <div className="md:col-span-2 flex flex-col items-center pb-4">
              <div className="w-32 h-40 rounded-lg border-2 border-dashed border-blue-200 overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs">Passport Photo</span>}
              </div>
              <input id="photo" type="file" accept="image/*" required onChange={handlePhotoChange} className="hidden" />
              <label htmlFor="photo" className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase cursor-pointer hover:bg-blue-700">Upload Passport</label>
            </div>

            {/* NEW: MANUAL CLIENT ID INPUT */}
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <label className="text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
                Assign Client ID <MdFingerprint />
              </label>
              <input 
                name="manualClientId" 
                className="input-field border-2 border-blue-200 text-blue-800" 
                placeholder="Enter Unique ID (e.g. SHER-2026-001)" 
                required 
              />
              <p className="text-[9px] text-blue-400 mt-1 italic">*This ID will be used for all future logins and database queries.</p>
            </div>

            {/* PERSONAL INFO */}
            <div className="md:col-span-2 text-blue-600 font-bold text-xs uppercase tracking-widest border-b pb-1 mb-2 mt-2">Personal Information</div>
            
            <input name="fullname" className="input-field md:col-span-2" placeholder="Full Name" required />
            <input name="pob" className="input-field" placeholder="Place of Birth" required />
            <input type="date" name="dob" className="input-field" required />
            
            <select name="gender" className="input-field" required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input name="nationality" className="input-field" placeholder="Nationality" required />
            <input name="tel" className="input-field" placeholder="Phone Number" required />
            <input name="email" type="email" className="input-field" placeholder="Email Address" required />
            <input name="occupation" className="input-field" placeholder="Current Occupation" required />
            
            <input name="address" className="input-field md:col-span-2" placeholder="Full Residential Address" required />

            <div className="md:col-span-2 text-blue-600 font-bold text-xs uppercase tracking-widest border-b pb-1 mt-4 mb-2">Academic & Membership</div>
            
            <input name="eduPeriod" className="input-field" placeholder="Educational Period (e.g. 2005-2011)" required />
            <input name="className" className="input-field" placeholder="Class of (Year)" required />

            <select name="membershipTier" className="input-field md:col-span-2 bg-gray-50" required>
              <option value="">-- Choose Membership Tier --</option>
              <option value="Regular">Regular Member</option>
              <option value="Gold">Gold Member</option>
              <option value="Platinum">Platinum Member</option>
            </select>

            <div className="md:col-span-2 mt-4">
              <label className="text-[10px] font-black text-blue-500 uppercase ml-1 flex items-center gap-1">Access Key <MdInfoOutline /></label>
              <input name="regCode" className="input-field w-full font-mono text-lg uppercase tracking-widest border-2 border-blue-100" placeholder="SH-XXXXXX" required />
            </div>

            {error && (
              <div className="md:col-span-2 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <MdErrorOutline className="text-red-500 text-xl" />
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}

            <button disabled={loading} className={`md:col-span-2 py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all ${loading ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700 shadow-lg"}`}>
              {loading ? "Processing..." : "Submit Registration"}
            </button>
          </form>
        </div>
      </main>

      {registeredClient && <IDCardModal client={registeredClient} onClose={() => setRegisteredClient(null)} />}
      
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 1rem;
          background-color: #f8fafc;
          border-radius: 1rem;
          outline: none;
          font-weight: 700;
          font-size: 0.875rem;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #2563eb;
          background-color: white;
          box-shadow: 0 0 0 4px #dbeafe;
        }
      `}</style>
    </>
  );
}