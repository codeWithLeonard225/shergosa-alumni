"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { 
  collection, addDoc, serverTimestamp, 
  query, where, getDocs 
} from "firebase/firestore";
import imageCompression from 'browser-image-compression';
import { MdErrorOutline, MdInfoOutline, MdFingerprint, MdWarningAmber, MdSchool } from "react-icons/md"; 
import { uploadToCloudinary } from "@/app/lib/cloudinaryUpload";
import IDCardModal from "../../components/IDCardModal";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({}); 
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredClient, setRegisteredClient] = useState(null);

  // ⭐ Validation Logic including EduPeriod
  const validateForm = (formData) => {
    const errors = {};
    if (!photo) errors.photo = "Passport photo is required";
    if (!formData.get("manualClientId")) errors.manualClientId = "Unique Client ID is required";
    if (!formData.get("fullname")) errors.fullname = "Full name is required";
    if (!formData.get("pob")) errors.pob = "Place of birth is required";
    if (!formData.get("dob")) errors.dob = "Date of birth is required";
    if (!formData.get("gender")) errors.gender = "Please select a gender";
    if (!formData.get("tel")) errors.tel = "Phone number is required";
    
    // ⭐ New validation for Academic fields
    if (!formData.get("eduPeriod")) errors.eduPeriod = "Educational period is required (e.g. 2005-2011)";
    if (!formData.get("className")) errors.className = "Graduation year is required";
    
    if (!formData.get("membershipTier")) errors.membershipTier = "Please select a membership tier";
    if (!formData.get("regCode")) errors.regCode = "Registration access key is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValidationErrors(prev => ({...prev, photo: null}));

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
    const form = e.target;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setLoading(true);
    setError("");

    const manualClientId = formData.get("manualClientId").trim().toUpperCase();
    const inputRegCode = formData.get("regCode").trim();

    try {
      const codeQuery = query(collection(db, "reg_codes"), where("code", "==", inputRegCode));
      const codeSnap = await getDocs(codeQuery);

      if (codeSnap.empty) {
        setValidationErrors(prev => ({...prev, regCode: "Invalid or non-existent code."}));
        setLoading(false);
        return;
      }

      const idDuplicateQuery = query(collection(db, "clients"), where("clientId", "==", manualClientId));
      const idDuplicateSnap = await getDocs(idDuplicateQuery);

      if (!idDuplicateSnap.empty) {
        setValidationErrors(prev => ({...prev, manualClientId: "This ID is already taken."}));
        setLoading(false);
        return;
      }

      const photoURL = await uploadToCloudinary(photo);

      const clientData = {
        clientId: manualClientId,
        fullname: formData.get("fullname"),
        orgId: "SHERGOSA",
        role: "client",
        pob: formData.get("pob"), 
        dob: formData.get("dob"),
        gender: formData.get("gender"),
        nationality: formData.get("nationality"), 
        occupation: formData.get("occupation"),
        tel: formData.get("tel"),
        email: formData.get("email"), 
        address: formData.get("address"),
        eduPeriod: formData.get("eduPeriod"), // ⭐ Captured
        className: formData.get("className"), 
        membershipTier: formData.get("membershipTier"), 
        regCode: inputRegCode,
        photoURL,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "clients"), clientData);
      setRegisteredClient(clientData);
      form.reset();
      setPhotoPreview(null);
      setPhoto(null);
      setValidationErrors({});

    } catch (err) {
      setError("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ name }) => (
    validationErrors[name] ? (
        <p className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
            <MdWarningAmber /> {validationErrors[name]}
        </p>
    ) : null
  );

  return (
    <>
      <main className="min-h-screen bg-slate-50 flex justify-center px-6 py-10">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-sky-400">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">SHERGOSA Membership</h1>
            <p className="text-gray-500 font-medium">SOS Hermann Gmeiner Old Students' Association</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* PHOTO UPLOAD */}
            <div className="md:col-span-2 flex flex-col items-center pb-4">
              <div className={`w-32 h-40 rounded-lg border-2 border-dashed overflow-hidden mb-4 bg-gray-50 flex items-center justify-center ${validationErrors.photo ? 'border-red-400' : 'border-blue-200'}`}>
                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs text-center p-4">Member Photo</span>}
              </div>
              <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <label htmlFor="photo" className="bg-sky-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase cursor-pointer hover:bg-sky-600 transition-all">Upload Photo</label>
              <InputError name="photo" />
            </div>

            {/* ASSIGN ID */}
            <div className={`md:col-span-2 p-4 rounded-2xl border ${validationErrors.manualClientId ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
              <label className="text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
                Assign Membership ID <MdFingerprint />
              </label>
              <input 
                name="manualClientId" 
                className={`input-field border-2 text-blue-800 ${validationErrors.manualClientId ? 'border-red-300' : 'border-blue-200'}`} 
                placeholder="e.g. SHER-2026-001" 
              />
              <InputError name="manualClientId" />
            </div>

            <div className="md:col-span-2 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-1 mb-2 mt-4">Personal Details</div>
            
            <div className="md:col-span-2">
                <input name="fullname" className="input-field" placeholder="Full Name" />
                <InputError name="fullname" />
            </div>

            <div>
                <input name="pob" className="input-field" placeholder="Place of Birth" />
                <InputError name="pob" />
            </div>

            <div>
                <input type="date" name="dob" className="input-field" />
                <InputError name="dob" />
            </div>
            
            <div>
                <select name="gender" className="input-field">
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <InputError name="gender" />
            </div>

            <div>
                <input name="tel" className="input-field" placeholder="Phone Number" />
                <InputError name="tel" />
            </div>

            <div className="md:col-span-2 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-1 mt-6 mb-2">School Records <MdSchool className="inline ml-1" /></div>
            
            {/* ⭐ EDUCATIONAL PERIOD FIELD */}
            <div>
                <input 
                  name="eduPeriod" 
                  className="input-field" 
                  placeholder="Edu. Period (e.g. 2005-2011)" 
                />
                <InputError name="eduPeriod" />
            </div>

            <div>
                <input name="className" className="input-field" placeholder="Graduating Class (Year)" />
                <InputError name="className" />
            </div>

            <div className="md:col-span-2">
                <select name="membershipTier" className="input-field bg-gray-50">
                <option value="">-- Choose Membership Tier --</option>
                <option value="Regular">Regular Member</option>
                <option value="Gold">Gold Member</option>
                <option value="Platinum">Platinum Member</option>
                </select>
                <InputError name="membershipTier" />
            </div>

            <div className={`md:col-span-2 mt-6 p-4 rounded-2xl border-2 ${validationErrors.regCode ? 'border-red-300 bg-red-50' : 'border-blue-100'}`}>
              <label className="text-[10px] font-black text-blue-500 uppercase ml-1 flex items-center gap-1">Access Key <MdInfoOutline /></label>
              <input name="regCode" className="input-field w-full font-mono text-lg uppercase tracking-widest bg-transparent" placeholder="SH-XXXXXX" />
              <InputError name="regCode" />
            </div>

            {error && (
              <div className="md:col-span-2 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <MdErrorOutline className="text-red-500 text-xl" />
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}

            <button disabled={loading} className={`md:col-span-2 py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all ${loading ? "bg-gray-300" : "bg-sky-500 hover:bg-sky-600 shadow-lg active:scale-95"}`}>
              {loading ? "Registering..." : "Complete Registration"}
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
          border-color: #38bdf8;
          background-color: white;
          box-shadow: 0 0 0 4px #e0f2fe;
        }
      `}</style>
    </>
  );
}