"use client";

export default function IDCardModal({ client, onClose }) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-4 relative shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* ================= ID CARD ================= */}
        <div className="border rounded-xl overflow-hidden">

          {/* Header */}
          <div className="bg-sky-500 text-white text-center py-4">
            <img
              src="/images/alumni-hero.jpg"
              alt="SOS Logo"
              className="w-14 h-14 mx-auto mb-2 bg-white rounded-full p-1"
            />
            <h2 className="text-sm font-extrabold tracking-wide">
             SHERGOSA-Alumni
            </h2>
            <p className="text-[11px] opacity-90">
              SOS Hermann Gmeiner Old Students' Association
            </p>
          </div>

          {/* Body */}
          <div className="bg-white px-5 py-4 text-sm">

            {/* Photo */}
            <div className="flex justify-center">
              <img
                src={client.photoURL}
                alt="Member"
                className="w-24 h-24 rounded-full border-4 border-sky-400 object-cover shadow-md"
              />
            </div>

            {/* Name & ID */}
            <div className="text-center mt-3">
              <p className="font-extrabold text-gray-800 text-base uppercase">
                {client.fullname}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                ID: {client.clientId}
              </p>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2 text-xs text-gray-700">
              <p className="flex justify-between">
                <span className="font-semibold">Gender</span>
                <span>{client.gender}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Telephone</span>
                <span>{client.tel}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Address</span>
                <span className="text-right">{client.address}</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-sky-100 text-center text-[10px] py-2 text-sky-700 font-semibold">
            Official Alumni Identification Card
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-center mt-3 text-gray-500">
          📸 Screenshot or print this ID card
        </p>
      </div>
    </div>
  );
}
