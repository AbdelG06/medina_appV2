import { motion, useReducedMotion } from "framer-motion";
import riadSoultana from "../assets/riad_soultana.jpg";
import fezAndFriends from "../assets/fez-and-friends.jpg";
import darRoumana from "../assets/dar-roumana.jpg";
import riad53 from "../assets/riad53.jpg";
import elforno from "../assets/elforno.jpg";

const places = [
  {
    name: "Riad Soultana",
    type: "Riad",
    description: "Riad traditionnel avec patio, chambres ?l?gantes et petit-d?jeuner marocain.",
    price: "D?s 500dh (50?/nuit)",
    contact: "@riadsoultana",
    site: "https://www.riadsoultana.site/",
    image: riadSoultana,
  },
  {
    name: "Caf? Fez and Friends",
    type: "Caf?",
    description: "Caf? embl?matique de la m?dina, cuisine fusion, concerts et ateliers culturels.",
    price: "? partir de 30 MAD",
    contact: "@fezandfriendss",
    site: "https://www.instagram.com/fezandfriendss",
    image: fezAndFriends,
  },
  {
    name: "Restaurant Dar Roumana",
    type: "Restaurant",
    description: "Cuisine marocaine raffin?e dans un cadre d'exception, vue sur la m?dina.",
    price: "Menu d?s 250 MAD",
    contact: "@darroumana",
    site: "https://darroumana.com",
    image: darRoumana,
  },
  {
    name: "Riad 53",
    type: "Riad",
    description: "H?bergement de charme, rooftop panoramique.",
    price: "D?s 80?/nuit",
    contact: "@Riad53",
    site: "https://www.moroccohotels.net/fr/hotel/riad-53-fes-luxury-oasis.html",
    image: riad53,
  },
  {
    name: "Elforno Fes",
    type: "Restaurant",
    description: "Cuisine marocaine raffin?e dans un cadre d'exception.",
    price: "Menu d?s 50 MAD",
    contact: "@elforno_fez",
    site: "https://www.instagram.com/elforno_fez/",
    image: elforno,
  },
];

const categories = ["Riad", "Caf?", "Restaurant"];

const CityLifeSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const cardMotion = shouldReduceMotion
    ? { initial: false, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <section id="citylife" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Vivre la M?dina
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hébergement, Cafés & Restaurants
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            S?lection de lieux authentiques pour s?journer, savourer et d?couvrir la vie locale.
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
                    initial={cardMotion.initial}
                    whileInView={cardMotion.whileInView}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.04, duration: 0.4 }}
                    className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-moroccan transition-shadow group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-heading text-lg font-semibold text-foreground">{p.name}</h4>
                        <span className="font-heading text-lg font-bold text-primary whitespace-nowrap ml-2">{p.price}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-3">{p.description}</p>
                      <p className="font-body text-xs text-moroccan-ochre-dark mb-2">?? {p.contact}</p>
                      <a
                        href={p.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-moroccan-ochre px-4 py-2 text-xs font-semibold text-primary-foreground shadow-moroccan hover:bg-moroccan-ochre-dark transition-colors"
                      >
                        Voir le site <span aria-hidden>?</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="max-w-4xl mx-auto bg-background border border-border rounded-2xl p-6 md:p-8 shadow-moroccan">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-moroccan-ochre-dark mb-3">
              Guide vidéo
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              🎥 Une immersion authentique au cœur des ateliers, des couleurs et des odeurs uniques qui font la
              richesse de Fès.
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
              <iframe
                src="https://www.youtube-nocookie.com/embed/5iktthj1V7c?si=5j7QabFyAtglDrz2"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityLifeSection;
