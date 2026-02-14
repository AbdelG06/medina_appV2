import React from "react";

const emergencyNumbers = [
  { label: "Police", number: "19" },
  { label: "Pompiers", number: "15" },
  { label: "Protection Civile", number: "15" },
  { label: "Ambulance", number: "15" },
];

export const EmergencyButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-2 bg-white rounded-lg shadow-lg p-4 space-y-2 animate-fade-in">
          {emergencyNumbers.map((item) => (
            <a
              key={item.label}
              href={`tel:${item.number}`}
              className="block px-4 py-2 rounded hover:bg-red-100 text-red-700 font-semibold text-sm transition"
            >
              {item.label} : {item.number}
            </a>
          ))}
        </div>
      )}
      <button
        aria-label="Urgence"
        onClick={() => setOpen((v) => !v)}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl font-bold border-4 border-white focus:outline-none focus:ring-2 focus:ring-red-400 animate-bounce-short"
      >
        !
      </button>
    </div>
  );
};
