import { motion } from "framer-motion";
import { Clock, Footprints, Gauge, ChevronRight } from "lucide-react";

interface Circuit {
  name: string;
  theme: string;
  duration: string;
  distance: string;
  difficulty: "Facile" | "Moyen";
  stops: string[];
  color: string;
}

const circuits: Circuit[] = [
  {
    name: "Circuit Spirituel",
    theme: "🕌 Religieux",
    duration: "2h30",
    distance: "2.5 km",
    difficulty: "Facile",
    stops: ["Zaouïa Moulay Idriss II", "Mosquée Al Quaraouiyine", "Médersa Attarine", "Médersa Bou Inania"],
    color: "from-primary to-moroccan-blue-light",
  },
  {
    name: "Circuit Artisanal",
    theme: "🎨 Artisanat",
    duration: "3h",
    distance: "3 km",
    difficulty: "Moyen",
    stops: ["Tanneries Chouara", "Souk des Teinturiers", "Place Seffarine", "Fondouk Nejjarine"],
    color: "from-moroccan-ochre to-moroccan-gold",
  },
  {
    name: "Circuit Historique",
    theme: "🏛 Histoire",
    duration: "4h",
    distance: "4.5 km",
    difficulty: "Moyen",
    stops: ["Bab Boujloud", "Dar Batha", "Palais Royal", "Tombeaux Mérinides", "Borj Nord"],
    color: "from-secondary to-moroccan-green-light",
  },
];

const CircuitsSection = () => {
  return (
    <section id="circuits" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Parcours Guidés
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Circuits Touristiques
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Choisissez un parcours selon vos centres d'intérêt et votre temps disponible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {circuits.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl overflow-hidden border border-border bg-card shadow-moroccan hover:shadow-lg transition-shadow"
            >
              {/* Header gradient */}
              <div className={`bg-gradient-to-r ${c.color} p-6 text-primary-foreground`}>
                <p className="text-sm font-body opacity-90 mb-1">{c.theme}</p>
                <h3 className="font-heading text-2xl font-bold">{c.name}</h3>
              </div>

              <div className="p-6">
                {/* Stats */}
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

                {/* Stops */}
                <div className="space-y-3">
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Étapes du parcours
                  </p>
                  {c.stops.map((stop, j) => (
                    <div key={stop} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {j + 1}
                      </span>
                      {stop}
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted text-foreground font-body font-medium text-sm hover:bg-muted/80 transition-colors">
                  Voir le détail <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CircuitsSection;
