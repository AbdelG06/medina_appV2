import React, { useState } from "react";

const emergencyContacts = [
  { label: "Police", number: "19", detail: "Interventions et sécurité" },
  { label: "Pompiers", number: "15", detail: "Incendies et secours" },
  { label: "Protection Civile", number: "15", detail: "Secours et sauvetage" },
  { label: "Ambulance", number: "15", detail: "Urgences médicales" },
];

const filterOptions = [
  {
    id: "police",
    label: "Police",
    icon: "🚔",
    className: "bg-moroccan-blue text-primary-foreground",
    mapSrc: "https://www.google.com/maps?q=police+fes&output=embed",
    link: "https://www.google.com/maps/search/police+fes",
  },
  {
    id: "hospital",
    label: "Hôpitaux",
    icon: "🏥",
    className: "bg-moroccan-terracotta text-primary-foreground",
    mapSrc: "https://www.google.com/maps?q=hopital+fes&output=embed",
    link: "https://www.google.com/maps/search/hopital+fes",
  },
  {
    id: "parking",
    label: "Parkings",
    icon: "🅿️",
    className: "bg-moroccan-green-light text-primary-foreground",
    mapSrc: "https://www.google.com/maps?q=parking+fes&output=embed",
    link: "https://www.google.com/maps/search/parking+fes",
  },
];

const EmergencyMapSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("police");
  const activeConfig = filterOptions.find((filter) => filter.id === activeFilter) ?? filterOptions[0];

  return (
    <section className="py-20 bg-card border-t border-border" id="urgence-map">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">Urgence</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Carte des services d'urgence à Fès
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Repérez rapidement les postes de police, hôpitaux et parkings proches de la médina.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_1.55fr] gap-8 items-stretch">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-moroccan">
            <h3 className="font-heading text-2xl font-bold text-moroccan-ochre-dark mb-3">Numéros utiles</h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Gardez ces contacts sous la main en cas d'urgence immédiate.
            </p>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <a
                  key={contact.label}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-body text-foreground hover:bg-muted transition-colors"
                >
                  <span>
                    <span className="font-semibold">{contact.label}</span>
                    <span className="block text-xs text-muted-foreground">{contact.detail}</span>
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {contact.number}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs font-body text-muted-foreground">
              Astuce: partagez votre position GPS lors de l'appel pour gagner du temps.
            </p>
          </div>

          <div className="bg-background border border-border rounded-2xl p-4 md:p-6 shadow-moroccan">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {filterOptions.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isActive ? filter.className : "bg-muted text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-border bg-muted/30">
              <iframe
                key={activeConfig.id}
                title={`Carte ${activeConfig.label} à Fès`}
                src={activeConfig.mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-4 text-xs font-body text-muted-foreground">
              Filtrez les services pour trouver rapidement l'aide la plus proche.{" "}
              <a
                href={activeConfig.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Ouvrir en plein écran
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyMapSection;
