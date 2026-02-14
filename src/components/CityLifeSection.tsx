import { motion } from "framer-motion";

const places = [
  {
    name: "Riad Dar Dmana",
    type: "Riad",
    description: "Riad traditionnel avec patio, chambres élégantes et petit-déjeuner marocain.",
    price: "Dès 60€/nuit",
    contact: "@riaddardmana",
    site: "https://riaddardmana.com",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop",
  },
  {
    name: "Café Clock",
    type: "Café",
    description: "Café emblématique de la médina, cuisine fusion, concerts et ateliers culturels.",
    price: "Plats 40-90 MAD",
    contact: "@cafeclockfes",
    site: "https://cafeclock.com",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop",
  },
  {
    name: "Restaurant Dar Roumana",
    type: "Restaurant",
    description: "Cuisine marocaine raffinée dans un cadre d'exception, vue sur la médina.",
    price: "Menu dès 250 MAD",
    contact: "@darroumana",
    site: "https://darroumana.com",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop",
  },
  {
    name: "Riad Fes Maya",
    type: "Riad",
    description: "Hébergement de charme, rooftop panoramique, spa et hammam.",
    price: "Dès 80€/nuit",
    contact: "@fesmaya",
    site: "https://fesmaya.com",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
  },
];

const categories = ["Riad", "Café", "Restaurant"];

const CityLifeSection = () => {
  return (
    <section id="citylife" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Vivre la Médina
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hébergement, Cafés & Restaurants
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Sélection de lieux authentiques pour séjourner, savourer et découvrir la vie locale.
          </p>
        </motion.div>
        <div className="space-y-16">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-moroccan-ochre-dark mb-6 text-left">
                {cat}s
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {places.filter((p) => p.type === cat).map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-moroccan transition-shadow group cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-heading text-lg font-semibold text-foreground">{p.name}</h4>
                        <span className="font-heading text-lg font-bold text-primary whitespace-nowrap ml-2">{p.price}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-3">{p.description}</p>
                      <p className="font-body text-xs text-moroccan-ochre-dark mb-1">
                        📱 {p.contact}
                      </p>
                      <a href={p.site} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline">
                        Voir le site
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityLifeSection;
