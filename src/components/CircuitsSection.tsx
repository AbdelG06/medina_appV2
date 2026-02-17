import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Footprints, Gauge, ChevronRight, X } from "lucide-react";

interface CircuitStop {
  name: string;
  description: string;
}

interface Circuit {
  name: string;
  theme: string;
  duration: string;
  distance: string;
  difficulty: "Facile" | "Moyen" | "Flexible";
  stops: CircuitStop[];
  color: string;
  mapUrl: string;
}

const circuits: Circuit[] = [
  {
    name: "Circuit Spirituel",
    theme: "🕌 Religieux",
    duration: "Environ 2h30",
    distance: "~ 2.5 km",
    difficulty: "Facile",
    stops: [
      { name: "Médersa Bou Inania", description: "Chef-d'œuvre mérinide, zellige et stucs finement sculptés." },
      { name: "Zaouïa Moulay Idriss II", description: "Sanctuaire majeur dédié au fondateur de Fès." },
      { name: "Zaouïa de Sidi Ahmed Tijani", description: "Lieu spirituel emblématique de la confrérie Tijania." },
      { name: "Médersa Al-Attarine", description: "Médersa raffinée, décor très soigné." },
      { name: "Mosquée Al Quaraouiyine", description: "Mosquée-université historique du IXe siècle." },
    ],
    color: "from-primary to-moroccan-blue-light",
    mapUrl: "https://maps.app.goo.gl/tGJGDXaG8e1unxxH6",
  },
  {
    name: "Circuit Artisanal",
    theme: "🎨 Artisanat",
    duration: "Environ 2h20",
    distance: "~ 2.6 km",
    difficulty: "Moyen",
    stops: [
      { name: "Musée Nejjarine", description: "Fondouk restauré dédié aux métiers du bois." },
      { name: "Musée Batha", description: "Ancien palais royal devenu musée d'arts traditionnels." },
      { name: "Tanneries Chouara", description: "Tanneries historiques aux cuves colorées." },
      { name: "Souk des Teinturiers", description: "Ateliers artisanaux de teinturerie." },
      { name: "Place Seffarine", description: "Place animée par les dinandiers." },
    ],
    color: "from-moroccan-ochre to-moroccan-gold",
    mapUrl: "https://maps.app.goo.gl/LiRMEfvgWKJmKHHu7",
  },
  {
    name: "Circuit Historique",
    theme: "🏛️ Histoire",
    duration: "Environ 4h",
    distance: "~ 4.5 km",
    difficulty: "Moyen",
    stops: [
      { name: "Palais Royal", description: "Portes monumentales et panorama sur Fès Jdid." },
      { name: "Bab Boujloud", description: "Porte bleue emblématique de la médina." },
      { name: "Dar Batha", description: "Ancien palais royal et jardin andalou." },
      { name: "Tombeaux Mérinides", description: "Nécropole avec vue sur la médina." },
      { name: "Borj Nord", description: "Forteresse offrant une vue panoramique." },
    ],
    color: "from-secondary to-moroccan-green-light",
    mapUrl: "https://maps.app.goo.gl/T89Qhr4Smnd7Ynxm8",
  },
  {
    name: "Circuit Mérinide",
    theme: "🧱 Architecture",
    duration: "Environ 2h",
    distance: "~ 2 km",
    difficulty: "Facile",
    stops: [
      { name: "Médersa Bounania", description: "Architecture mérinide et grand patio." },
      { name: "Palais Mnebhi", description: "Palais historique décoré de zellige." },
      { name: "Médersa Al-Attarine", description: "Médersa fine près de Seffarine." },
      { name: "Mosquée Al Quaraouiyine", description: "Centre spirituel et intellectuel historique." },
    ],
    color: "from-moroccan-terracotta to-moroccan-gold",
    mapUrl: "https://maps.app.goo.gl/u4jNr5YYfok7RPYG7",
  },
  {
    name: "Circuit Panorama & Culture",
    theme: "🌄 Culture",
    duration: "Environ 3h",
    distance: "~ 2.2 km",
    difficulty: "Moyen",
    stops: [
      { name: "Jnan Sbil", description: "Jardin historique et oasis de verdure." },
      { name: "Dar Batha", description: "Arts traditionnels et jardin andalou." },
      { name: "Musée Nejjarine", description: "Fondouk et musée des arts du bois." },
      { name: "Seffarine", description: "Ateliers de cuivre et ambiance unique." },
      { name: "Borj Nord", description: "Point de vue et musée des armes." },
    ],
    color: "from-moroccan-blue-light to-secondary",
    mapUrl: "https://maps.app.goo.gl/EUMvwZJDYz3CHHhD8",
  },
  {
    name: "Circuit complet",
    theme: "🧭 Découverte",
    duration: "Flexible",
    distance: "~ 5 km",
    difficulty: "Flexible",
    stops: [
      { name: "Dar Batha", description: "Ancien palais royal et jardin andalou." },
      { name: "Bab Boujloud", description: "Porte bleue emblématique de la médina." },
      { name: "Médersa Bounania", description: "Médersa mérinide remarquable." },
      { name: "Palais Mnebhi", description: "Palais traditionnel richement décoré." },
      { name: "Musée Nejjarine", description: "Fondouk restauré dédié aux métiers du bois." },
      { name: "Zaouïa Moulay Idriss II", description: "Sanctuaire majeur dédié au fondateur de Fès." },
      { name: "Médersa Al-Attarine", description: "Zellige et stuc d'une grande finesse." },
      { name: "Mosquée Al Quaraouiyine", description: "Mosquée-université historique." },
      { name: "Zaouïa de Sidi Ahmed Tijani", description: "Sanctuaire spirituel de la Tijania." },
      { name: "Seffarine", description: "Place animée par les dinandiers." },
      { name: "Borj Nord", description: "Forteresse et panorama sur la médina." },
    ],
    color: "from-primary to-secondary",
    mapUrl: "https://maps.app.goo.gl/7UNFQmxsmPaZybZK8",
  },
];

const CircuitsSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const selectedCircuit = openIdx !== null ? circuits[openIdx] : null;

  return (
    <section id="circuits" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">Parcours Guidés</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Circuits Touristiques</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Choisissez un parcours selon vos centres d'intérêt et votre temps disponible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {circuits.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden border border-border bg-card shadow-moroccan hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r ${c.color} p-6 text-primary-foreground`}>
                <p className="text-sm font-body opacity-90 mb-1">{c.theme}</p>
                <h3 className="font-heading text-2xl font-bold">{c.name}</h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={16} className="text-primary" /> {c.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Footprints size={16} className="text-primary" /> {c.distance}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Gauge size={16} className="text-primary" /> {c.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Étapes du parcours
                  </p>
                  {(c.name === "Circuit complet" ? c.stops.slice(0, 6) : c.stops).map((stop, j) => (
                    <div key={`${c.name}-${stop.name}`} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {j + 1}
                      </span>
                      {stop.name}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setOpenIdx(i)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted text-foreground font-body font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Voir le détail <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {openIdx !== null && selectedCircuit && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-3 overflow-y-auto">
            <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full mx-auto my-10 animate-fade-in">
              <button
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-muted/90 hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                onClick={() => setOpenIdx(null)}
                aria-label="Fermer"
                tabIndex={0}
              >
                <X size={22} />
              </button>

              <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-moroccan-ochre scrollbar-track-muted rounded-2xl touch-pan-y">
                <p className="text-sm font-body opacity-80 text-muted-foreground mb-1">{selectedCircuit.theme}</p>
                <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">{selectedCircuit.name}</h3>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {selectedCircuit.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Footprints size={14} /> {selectedCircuit.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge size={14} /> {selectedCircuit.difficulty}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  {selectedCircuit.stops.map((stop, idx) => (
                    <div key={`${selectedCircuit.name}-${stop.name}`} className="rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-body text-sm font-semibold text-foreground">{stop.name}</p>
                          <p className="font-body text-xs text-muted-foreground">{stop.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={selectedCircuit.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Ouvrir le circuit dans Google Maps <ChevronRight size={16} />
                </a>

                <p className="mt-4 text-xs font-body text-muted-foreground">
                  NB: téléchargez à l'avance Google Maps hors ligne pour un usage sans internet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CircuitsSection;
