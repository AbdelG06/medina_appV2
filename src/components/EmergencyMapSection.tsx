import React from "react";

// Example police posts (replace with real coordinates if available)
const policePosts = [
  { name: "Poste Police Bab Boujloud", lat: 34.0622, lng: -4.9836 },
  { name: "Poste Police Rcif", lat: 34.0605, lng: -4.9782 },
  { name: "Poste Police Place Seffarine", lat: 34.0631, lng: -4.9747 },
];

export const EmergencyMapSection: React.FC = () => {
  return (
    <section className="py-16 bg-red-50 border-t border-red-200" id="urgence-map">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-red-700 mb-6 text-center">
          Urgence : Postes de Police dans la Médina
        </h2>
        <div className="w-full h-96 rounded-xl overflow-hidden border border-red-200 bg-white flex items-center justify-center mb-6">
          {/* Static map with markers (replace with real map if needed) */}
          <img
            src="https://maps.googleapis.com/maps/api/staticmap?center=34.0622,-4.9836&zoom=15&size=700x350&maptype=roadmap&markers=color:red%7Clabel:P%7C34.0622,-4.9836&markers=color:red%7Clabel:P%7C34.0605,-4.9782&markers=color:red%7Clabel:P%7C34.0631,-4.9747&key=YOUR_API_KEY"
            alt="Carte des postes de police de la médina"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <ul className="flex flex-wrap gap-6 justify-center">
          {policePosts.map((post) => (
            <li key={post.name} className="bg-white border border-red-200 rounded-lg px-4 py-2 shadow text-red-700 font-body text-sm">
              <span className="font-bold">{post.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
