import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import mosqueeAlKaraouine from "@/assets/mosquee-al-karaouine.jpg";

const monuments = [
  {
    name: "Mosquée Al Quaraouiyine",
    category: "Mosquée",
    description: "Fondée en 859, c'est la plus ancienne université du monde encore en activité. Un joyau de l'architecture islamique.",
    hours: "Visible de l'extérieur",
    duration: "30 min",
    image: mosqueeAlKaraouine,
  },
  {
    name: "Médersa Bou Inania",
    category: "Médersa",
    description: "Chef-d'œuvre de l'art mérinide (1351-1356), ornée de zellige, stuc sculpté et bois de cèdre.",
    hours: "9h - 17h",
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1548017045-3816c345ac29?w=600&h=400&fit=crop",
  },
  {
    name: "Tanneries Chouara",
    category: "Artisanat",
    description: "Les plus anciennes tanneries au monde, où le cuir est traité selon des méthodes ancestrales depuis le XIe siècle.",
    hours: "8h - 18h",
    duration: "1h",
    image: "https://images.unsplash.com/photo-1545071677-6c0225731065?w=600&h=400&fit=crop",
  },
  {
    name: "Musée Nejjarine",
    category: "Musée",
    description: "Ancien fondouk restauré, dédié aux arts et métiers du bois. Une collection unique d'objets artisanaux.",
    hours: "10h - 17h",
    duration: "1h",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  },
  {
    name: "Fondouk Nejjarine",
    category: "Fondouk",
    description: "Caravansérail du XVIIIe siècle, magnifiquement restauré avec une fontaine en zellige et boiseries sculptées.",
    hours: "10h - 17h",
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600&h=400&fit=crop",
  },
  {
    name: "Place Seffarine",
    category: "Place",
    description: "La plus ancienne place de la médina, célèbre pour ses artisans du cuivre martelant bassins et plateaux.",
    hours: "Accès libre",
    duration: "20 min",
    image: "https://images.unsplash.com/photo-1580752300992-559f8e11aed2?w=600&h=400&fit=crop",
  },
];

const categoryColors: Record<string, string> = {
  Mosquée: "bg-primary text-primary-foreground",
  Médersa: "bg-secondary text-secondary-foreground",
  Artisanat: "bg-moroccan-ochre text-accent-foreground",
  Musée: "bg-moroccan-terracotta text-primary-foreground",
  Fondouk: "bg-moroccan-blue-light text-primary-foreground",
  Place: "bg-moroccan-green-light text-primary-foreground",
};

const HeritageSection = () => {
  return (
    <section id="patrimoine" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Guide Touristique
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Patrimoine de la Médina
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Explorez les trésors architecturaux et culturels d'une ville qui a traversé 12 siècles d'histoire.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monuments.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden shadow-moroccan hover:shadow-lg transition-shadow border border-border"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[m.category] || "bg-muted text-muted-foreground"}`}>
                  {m.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {m.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                  {m.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {m.hours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} /> {m.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> Médina
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
