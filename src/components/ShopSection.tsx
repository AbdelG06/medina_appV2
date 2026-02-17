import { motion, useReducedMotion } from "framer-motion";
import belghaImage from "../assets/belgha.jpg";
import caftanImage from "../assets/caftan.jpg";
import chebakiaImage from "../assets/chebakia.jpg";
import cuivreImage from "../assets/Cuivre.jpg";
import epicesImage from "../assets/epices.jpg";
import huileImage from "../assets/huile.jpg";
import mielImage from "../assets/Miel.jpg";
import sacImage from "../assets/sac.jpg";
import tapisImage from "../assets/Tapis.jpg";
import zelligeImage from "../assets/zelige.jpg";

const categories = [
  {
    name: "Artisanat du cuir et tannage",
    products: [
      {
        name: "Babouches en cuir",
        artisan: "Maître Hassan, Souk Sabbaghin",
        price: "150 MAD",
        description: "Babouches traditionnelles en cuir tanné naturellement, cousues à la main.",
        image: belghaImage,
      },
      {
        name: "Sac en cuir",
        artisan: "Zinelabidin, kissariat al kifah",
        price: "250 MAD",
        description: "Sac bandoulière en cuir de chèvre tanné traditionnellement, teinture végétale.",
        image: sacImage,
      },
    ],
  },
  {
    name: "Céramique & poterie",
    products: [
      {
        name: "Plateau en cuivre ciselé",
        artisan: "Maître Ahmed, Place Seffarine",
        price: "350 MAD",
        description: "Plateau décoratif gravé à la main avec des motifs géométriques traditionnels.",
        image: cuivreImage,
      },
      {
        name: "Zellige artisanal",
        artisan: "Atelier Benjelloun, Fès el-Bali",
        price: "80 MAD / pièce",
        description: "Carreau de zellige taillé et émaillé à la main, motif étoile à 8 branches.",
        image: zelligeImage,
      },
    ],
  },
  {
    name: "Épices, huiles & parfums",
    products: [
      {
        name: "Épices du souk",
        artisan: "Épicerie El Attarine",
        price: "30 MAD / sachet",
        description: "Mélange d'épices locales pour tajines et couscous.",
        image: epicesImage,
      },
      {
        name: "Huile d'argan",
        artisan: "Coopérative Argania",
        price: "120 MAD / 250ml",
        description: "Huile d'argan pure, pressée à froid, idéale cuisine et cosmétique.",
        image: huileImage,
      },
    ],
  },
  {
    name: "Produits gastronomiques locaux",
    products: [
      {
        name: "Miel de fleurs d'oranger",
        artisan: "Apiculteur Fassi",
        price: "90 MAD / pot",
        description: "Miel artisanal récolté dans la région de Fès.",
        image: mielImage,
      },
      {
        name: "Pâtisseries marocaines",
        artisan: "Pâtisserie La Médina",
        price: "60 MAD / boîte",
        description: "Assortiment de cornes de gazelle, briouates, chebakia...",
        image: chebakiaImage,
      },
    ],
  },
  {
    name: "Souvenirs & objets décoratifs",
    products: [
      {
        name: "Tapis berbère",
        artisan: "Coopérative Aïn Nokbi",
        price: "1 200 MAD",
        description: "Tapis noué main en laine naturelle, motifs tribaux du Moyen Atlas.",
        image: tapisImage,
      },
      {
        name: "Caftan brodé",
        artisan: "Atelier Fassi, Derb Tazi",
        price: "2 500 MAD",
        description: "Caftan en soie brodé à la main avec fil d'or, travail de plusieurs semaines.",
        image: caftanImage,
      },
    ],
  },
];

const ShopSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="boutique" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            Artisanat Authentique
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Boutique de la Médina
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Des prix transparents et équitables pour un artisanat authentique, directement des maîtres artisans.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary font-body text-xs font-semibold border border-secondary/30">
            Prix fixes et transparents
          </span>
          <span className="inline-block px-4 py-1.5 rounded-full bg-moroccan-ochre/20 text-moroccan-ochre-dark font-body text-xs font-semibold border border-moroccan-ochre/30">
            Qualité artisanale
          </span>
        </motion.div>

        <div className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-moroccan-ochre-dark mb-6 text-left">
                {cat.name}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {cat.products.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
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
                        <span className="font-heading text-lg font-bold text-primary whitespace-nowrap ml-2">
                          {p.price}
                        </span>
                      </div>
                      <p className="font-body text-xs text-moroccan-ochre-dark mb-2">{p.artisan}</p>
                      <p className="font-body text-sm text-muted-foreground mb-3">{p.description}</p>
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

export default ShopSection;
