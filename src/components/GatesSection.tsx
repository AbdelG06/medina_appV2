import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import babImg from "@/assets/bab-boujloud.jpg";

interface Gate {
  name: string;
  monument: string;
  description: string;
  anecdote: string;
}

const gates: Gate[] = [
  { name: "Bab Boujloud", monument: "Médersa Bou Inania", description: "La porte emblématique aux zellige bleus et verts, entrée principale de Fès el-Bali.", anecdote: "Construite en 1913, elle est ornée de zellige bleu côté extérieur (couleur de Fès) et vert côté intérieur (couleur de l'Islam)." },
  { name: "Bab Ftouh", monument: "Cimetière Bab Ftouh", description: "Porte sud de la médina, menant vers le plus grand cimetière de la ville.", anecdote: "Son nom signifie 'Porte de la Conquête', en référence aux expéditions militaires des dynasties marocaines." },
  { name: "Bab Guissa", monument: "Hôtel Palais Jamai", description: "Porte nord surplombant la médina, offrant une vue panoramique spectaculaire.", anecdote: "À proximité se trouve le palais Jamai, ancien palais du grand vizir transformé en hôtel de luxe." },
  { name: "Bab Rcif", monument: "Mosquée Er-Rcif", description: "Porte donnant accès au quartier commerçant animé de Rcif.", anecdote: "Le quartier Rcif est célèbre pour son marché aux épices et ses souks de produits frais." },
  { name: "Bab Semmarine", monument: "Souk des épices", description: "Porte menant au cœur commercial de la médina.", anecdote: "Le souk Semmarine regorge de montagnes d'épices colorées, de fruits secs et de produits traditionnels." },
  { name: "Bab Chorfa", monument: "Zaouïa Moulay Idriss II", description: "Porte noble menant au mausolée du fondateur spirituel de Fès.", anecdote: "Le mausolée de Moulay Idriss II est le lieu de pèlerinage le plus vénéré de la ville." },
  { name: "Bab Mahrouk", monument: "Borj Nord", description: "Porte historique proche de la forteresse nord de la ville.", anecdote: "Le Borj Nord abrite le Musée des Armes, avec une collection datant du Néolithique." },
  { name: "Bab Segma", monument: "Tombeaux Mérinides", description: "Porte donnant accès aux ruines des tombeaux de la dynastie mérinide.", anecdote: "Les ruines offrent l'un des plus beaux points de vue au coucher du soleil sur la médina." },
  { name: "Bab Jdid", monument: "Jardin Jnan Sbil", description: "La 'Porte Neuve' menant aux célèbres jardins royaux.", anecdote: "Les jardins Jnan Sbil, créés au XVIIIe siècle, sont le poumon vert de Fès." },
  { name: "Bab Lamar", monument: "Place Lalla Yeddouna", description: "Porte menant vers la place culturelle et artistique de la médina.", anecdote: "La place Lalla Yeddouna a été rénovée pour devenir un centre culturel moderne au cœur de la médina." },
  { name: "Bab Sidi Bou Jida", monument: "Fondouk Sagha", description: "Porte historique menant au quartier des orfèvres.", anecdote: "Le fondouk Sagha était le centre névralgique de l'orfèvrerie et de la bijouterie traditionnelle." },
  { name: "Bab Ziat", monument: "Dar Batha", description: "Porte menant au palais Batha, musée des arts et traditions.", anecdote: "Le musée Dar Batha possède la plus riche collection de céramique bleue de Fès." },
];

const GatesSection = () => {
  const [selected, setSelected] = useState<Gate | null>(null);

  return (
    <section id="portes" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Portes Historiques
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Les 12 Portes de la Médina
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Chaque porte est une entrée vers un monde de découvertes. Cliquez pour explorer.
          </p>
        </motion.div>

        {/* Gates grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {gates.map((gate, i) => (
            <motion.button
              key={gate.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(gate)}
              className="group relative aspect-square rounded-xl bg-moroccan-gradient p-[2px] hover:shadow-moroccan transition-shadow cursor-pointer"
            >
              <div className="w-full h-full rounded-xl bg-card flex flex-col items-center justify-center p-3 group-hover:bg-card/90 transition-colors">
                <span className="text-3xl mb-2">🚪</span>
                <span className="font-heading text-sm font-semibold text-foreground text-center leading-tight">
                  {gate.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-48">
                  <img src={babImg} alt={selected.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-heading text-2xl font-bold text-moroccan-cream">
                    {selected.name}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/30 flex items-center justify-center text-moroccan-cream hover:bg-foreground/50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="font-body text-foreground mb-3">{selected.description}</p>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="font-body text-sm text-muted-foreground">
                      <span className="font-semibold text-moroccan-ochre-dark">🏛 Monument à proximité : </span>
                      {selected.monument}
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <p className="font-body text-sm text-foreground/80">
                      <span className="font-semibold text-primary">📜 Anecdote : </span>
                      {selected.anecdote}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GatesSection;
