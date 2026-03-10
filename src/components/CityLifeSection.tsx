import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { api } from "@/lib/apiClient";
import { OptimizedImage } from "@/components/OptimizedImage";
import riadSoultana from "../assets/riad_soultana.jpg";
import fezAndFriends from "../assets/fez-and-friends.jpg";
import moorishCabana from "../assets/moorish_cabana.jpg";
import darRoumana from "../assets/dar-roumana.jpg";
import riad53 from "../assets/riad53.jpg";
import elforno from "../assets/elforno.jpg";

type LocalizedText = { fr: string; en: string };
type PlaceType = "riad" | "cafe" | "restaurant";

type Place = {
  _id?: string;
  name: string;
  type: PlaceType;
  description: LocalizedText;
  price: string;
  contact: string;
  site: string;
  image: string;
};

type ApiContentItem = {
  _id: string;
  type: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  contact?: string;
  site?: string;
};

const fallbackPlaces: Place[] = [
  {
    name: "Riad Soultana",
    type: "riad",
    description: {
      fr: "Riad traditionnel avec patio, chambres elegantes et petit-dejeuner marocain.",
      en: "Traditional riad with patio, elegant rooms and Moroccan breakfast.",
    },
    price: "Des 500 DH (environ 50 EUR / nuit)",
    contact: "@riadsoultana",
    site: "https://www.riadsoultana.site/",
    image: riadSoultana,
  },
  {
    name: "Fez and Friends",
    type: "cafe",
    description: {
      fr: "Cafe emblematique de la medina: cuisine fusion, concerts et ateliers culturels.",
      en: "Iconic medina cafe with fusion cuisine, live music and cultural workshops.",
    },
    price: "A partir de 30 MAD",
    contact: "@fezandfriendss",
    site: "https://www.instagram.com/fezandfriendss",
    image: fezAndFriends,
  },
  {
    name: "Moorish Cabana",
    type: "cafe",
    description: {
      fr: "Cafe chaleureux en face de Derb Lmezdaa, boissons et pause gourmande.",
      en: "Warm cafe near Derb Lmezdaa with drinks and sweet breaks.",
    },
    price: "06 28 65 29 39",
    contact: "@moorishcabana",
    site: "tel:0628652939",
    image: moorishCabana,
  },
  {
    name: "Restaurant Dar Roumana",
    type: "restaurant",
    description: {
      fr: "Cuisine marocaine raffinee dans un cadre d'exception avec vue sur la medina.",
      en: "Refined Moroccan cuisine with exceptional medina views.",
    },
    price: "Menu des 250 MAD",
    contact: "@darroumana",
    site: "https://darroumana.com",
    image: darRoumana,
  },
  {
    name: "Riad 53",
    type: "riad",
    description: {
      fr: "Hebergement de charme avec rooftop panoramique.",
      en: "Charming accommodation with panoramic rooftop.",
    },
    price: "Des 80 EUR / nuit",
    contact: "@riad53",
    site: "https://www.moroccohotels.net/fr/hotel/riad-53-fes-luxury-oasis.html",
    image: riad53,
  },
  {
    name: "Elforno Fes",
    type: "restaurant",
    description: {
      fr: "Cuisine marocaine et mediterraneenne dans une ambiance conviviale.",
      en: "Moroccan and Mediterranean cuisine in a friendly atmosphere.",
    },
    price: "Menu des 50 MAD",
    contact: "@elforno_fez",
    site: "https://www.instagram.com/elforno_fez/",
    image: elforno,
  },
];

const categories: Array<{ id: PlaceType; label: LocalizedText }> = [
  { id: "riad", label: { fr: "Riads", en: "Riads" } },
  { id: "cafe", label: { fr: "Cafes", en: "Cafes" } },
  { id: "restaurant", label: { fr: "Restaurants", en: "Restaurants" } },
];

const CityLifeSection = () => {
  const { language, t } = useAppSettings();
  const shouldReduceMotion = useReducedMotion();
  const [dbPlaces, setDbPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const result = await api.get<{ items: ApiContentItem[] }>("/api/content?type=restaurant,cafe,riad");
        const normalized = (result.items || [])
          .filter((item) => ["restaurant", "cafe", "riad"].includes(item.type))
          .map<Place>((item) => ({
            _id: item._id,
            name: item.name || "Sans nom",
            type: item.type as PlaceType,
            description: {
              fr: item.description || "",
              en: item.description || "",
            },
            price: item.price || "",
            contact: item.contact || "",
            site: item.site || "",
            image: item.imageUrl || "",
          }));
        setDbPlaces(normalized);
      } catch {
        setDbPlaces([]);
      }
    };

    void loadPlaces();
  }, []);

  const places = useMemo(() => (dbPlaces.length ? dbPlaces : fallbackPlaces), [dbPlaces]);
  const getText = (value: LocalizedText) => (language === "en" ? value.en : value.fr);

  return (
    <section id="citylife" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">{t("Vivre la Medina", "Live the Medina")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t("Riads, Cafes et Restaurants", "Riads, Cafes and Restaurants")}</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">{t("Selection de lieux authentiques pour dormir, manger et profiter de Fes.", "Selection of authentic places to stay, eat and enjoy Fez.")}</p>
        </motion.div>

        <div className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-moroccan-ochre-dark mb-6 text-left">{getText(cat.label)}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {places.filter((p) => p.type === cat.id).map((p, i) => (
                  <motion.div
                    key={p._id || p.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.04, duration: 0.4 }}
                    className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-moroccan transition-shadow group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <OptimizedImage src={p.image} alt={p.name} className="w-full h-full group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 50vw, 33vw" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h4 className="font-heading text-lg font-semibold text-foreground">{p.name}</h4>
                        <span className="font-heading text-sm md:text-base font-bold text-primary text-right">{p.price || "-"}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-3">{getText(p.description)}</p>
                      <p className="font-body text-xs text-moroccan-ochre-dark mb-2">{p.contact || "-"}</p>
                      {p.site ? (
                        <a href={p.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-moroccan-ochre px-4 py-2 text-xs font-semibold text-primary-foreground shadow-moroccan hover:bg-moroccan-ochre-dark transition-colors">
                          {t("Voir le site", "View site")}
                        </a>
                      ) : null}
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
