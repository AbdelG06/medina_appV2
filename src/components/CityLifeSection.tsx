import { motion, useReducedMotion } from "framer-motion";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import riadSoultana from "../assets/riad_soultana.jpg";
import fezAndFriends from "../assets/fez-and-friends.jpg";
import moorishCabana from "../assets/moorish_cabana.JPG";
import darRoumana from "../assets/dar-roumana.jpg";
import riad53 from "../assets/riad53.jpg";
import elforno from "../assets/elforno.jpg";

type LocalizedText = { fr: string; ar: string };

type Place = {
  name: string;
  type: "Riad" | "Cafe" | "Restaurant";
  description: LocalizedText;
  price: string;
  contact: string;
  site: string;
  image: string;
};

const places: Place[] = [
  {
    name: "Riad Soultana",
    type: "Riad",
    description: {
      fr: "Riad traditionnel avec patio, chambres elegantes et petit-dejeuner marocain.",
      ar: "رياض تقليدي مع فناء وغرف أنيقة وفطور مغربي.",
    },
    price: "Des 500 DH (environ 50 EUR / nuit)",
    contact: "@riadsoultana",
    site: "https://www.riadsoultana.site/",
    image: riadSoultana,
  },
  {
    name: "Fez and Friends",
    type: "Cafe",
    description: {
      fr: "Cafe emblematique de la medina: cuisine fusion, concerts et ateliers culturels.",
      ar: "مقهى رمزي في المدينة: مطبخ فيوجن، حفلات وورشات ثقافية.",
    },
    price: "A partir de 30 MAD",
    contact: "@fezandfriendss",
    site: "https://www.instagram.com/fezandfriendss",
    image: fezAndFriends,
  },
  {
    name: "Moorish Cabana",
    type: "Cafe",
    description: {
      fr: "Cafe chaleureux en face de Derb Lmezdaa, boissons et pause gourmande.",
      ar: "مقهى دافئ مقابل درب لمزدة، مشروبات واستراحة لذيذة.",
    },
    price: "06 28 65 29 39",
    contact: "@moorishcabana",
    site: "tel:0628652939",
    image: moorishCabana,
  },
  {
    name: "Restaurant Dar Roumana",
    type: "Restaurant",
    description: {
      fr: "Cuisine marocaine raffinee dans un cadre d'exception avec vue sur la medina.",
      ar: "مطبخ مغربي راق في أجواء مميزة مع إطلالة على المدينة.",
    },
    price: "Menu des 250 MAD",
    contact: "@darroumana",
    site: "https://darroumana.com",
    image: darRoumana,
  },
  {
    name: "Riad 53",
    type: "Riad",
    description: {
      fr: "Hebergement de charme avec rooftop panoramique.",
      ar: "إقامة أنيقة مع سطح بانورامي.",
    },
    price: "Des 80 EUR / nuit",
    contact: "@riad53",
    site: "https://www.moroccohotels.net/fr/hotel/riad-53-fes-luxury-oasis.html",
    image: riad53,
  },
  {
    name: "Elforno Fes",
    type: "Restaurant",
    description: {
      fr: "Cuisine marocaine et mediterraneenne dans une ambiance conviviale.",
      ar: "مطبخ مغربي ومتوسطي في أجواء ودية.",
    },
    price: "Menu des 50 MAD",
    contact: "@elforno_fez",
    site: "https://www.instagram.com/elforno_fez/",
    image: elforno,
  },
];

const categories: Array<{ id: Place["type"]; label: LocalizedText }> = [
  { id: "Riad", label: { fr: "Riads", ar: "رياضات" } },
  { id: "Cafe", label: { fr: "Cafes", ar: "مقاهي" } },
  { id: "Restaurant", label: { fr: "Restaurants", ar: "مطاعم" } },
];

const CityLifeSection = () => {
  const { language, t } = useAppSettings();
  const shouldReduceMotion = useReducedMotion();
  const getText = (value: LocalizedText) => (language === "ar" ? value.ar : value.fr);

  return (
    <section id="citylife" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">{t("Vivre la Medina", "عيش المدينة")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t("Riads, Cafes et Restaurants", "رياضات، مقاهي ومطاعم")}</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">{t("Selection de lieux authentiques pour dormir, manger et profiter de Fes.", "اختيارات أماكن أصيلة للنوم والأكل والاستمتاع بفاس.")}</p>
        </motion.div>

        <div className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-moroccan-ochre-dark mb-6 text-left">{getText(cat.label)}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {places.filter((p) => p.type === cat.id).map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.04, duration: 0.4 }}
                    className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-moroccan transition-shadow group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h4 className="font-heading text-lg font-semibold text-foreground">{p.name}</h4>
                        <span className="font-heading text-sm md:text-base font-bold text-primary text-right">{p.price}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-3">{getText(p.description)}</p>
                      <p className="font-body text-xs text-moroccan-ochre-dark mb-2">Instagram: {p.contact}</p>
                      <a href={p.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-moroccan-ochre px-4 py-2 text-xs font-semibold text-primary-foreground shadow-moroccan hover:bg-moroccan-ochre-dark transition-colors">
                        {t("Voir le site", "عرض")}
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
