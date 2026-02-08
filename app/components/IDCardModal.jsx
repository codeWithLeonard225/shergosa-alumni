"use client";

export default function IDCardModal({ client, onClose }) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-5 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* ID CARD */}
        <div className="border-2 rounded-lg p-4 text-sm">

          {/* Organization Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/images/logo.png" // Replace with your logo path
              alt="Organization Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h2 className="text-center font-bold text-green-700 mb-3">
            HAPPY LIFE ORGANIZATION
          </h2>

          {/* Client Photo */}
          <img
            src={client.photoURL}
            alt="Client"
            className="w-24 h-24 rounded-full mx-auto my-3 border"
          />

          <p className="text-center font-bold">{client.fullname}</p>
          <p className="text-center text-xs">{client.clientId}</p>

          <div className="mt-3 space-y-1">
            <p><b>Gender:</b> {client.gender}</p>
            <p><b>Tel:</b> {client.tel}</p>
            <p><b>Address:</b> {client.address}</p>
          </div>
        </div>

        {/* Actions */}
        <p className="text-xs text-center mt-3 text-gray-500">
          📸 Take a screenshot or print this ID card
        </p>

        {/* <button
          onClick={() => window.print()}
          className="mt-3 w-full bg-green-600 text-white py-2 rounded"
        >
          Print ID Card
        </button> */}
      </div>
    </div>
  );
}
