import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, MapPin, SlidersHorizontal, Star, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import mosqueeAlKaraouine from "../assets/mosquee-al-karaouine.PNG";
import ecoleBounania from "../assets/ecole_bounania.jpg";
import tannerie from "../assets/tannerie.jpg";
import museeNejjarin from "../assets/musee-nejjarine.jpg";
import myIdriss from "../assets/my-idriss.jpg";
import seffarine from "../assets/seffarine.jpg";
import attarin from "../assets/attarin.jpg";
import darBatha from "../assets/Dar-batha.jpg";
import borjNord from "../assets/Borj_nord.jpg";
import zaouiaSidiAhmedTijani from "../assets/Zaouia-Sidi-Ahmed-Tijani.jpg";
import portePalais from "../assets/Porte_palais.jpg";
import jnanSbil from "../assets/Jnan_Sbil.jpg";
import mosqueAndalous from "../assets/Mosque_andalous.jpg";
import palaisMnebhi from "../assets/palais_mnebhi.jpg";

type Monument = {
  name: string;
  category: string;
  description: string;
  hours: string;
  duration: string;
  image: string;
  details: string[];
};

type MapConfig = {
  embedUrl?: string;
  linkUrl?: string;
};

const INITIAL_VISIBLE_MONUMENTS = 6;
const LOAD_MORE_STEP = 4;
const ALL_CATEGORIES = "all";

const categoryFilters = [
  { value: ALL_CATEGORIES, label: "Toutes catgories" },
  { value: "mosquee_mausolee", label: "Mosque & Mausole" },
  { value: "medersa", label: "Mdersa (cole)" },
  { value: "Artisanat", label: "Artisanat" },
  { value: "Muse", label: "Muse" },
  { value: "Place", label: "Place" },
  { value: "Jardin", label: "Jardin" },
  { value: "Palais", label: "Palais" },
];

const categoryColors: Record<string, string> = {
  Mosque: "bg-primary text-primary-foreground",
  Mdersa: "bg-secondary text-secondary-foreground",
  "Mdersa & Mosque": "bg-secondary text-secondary-foreground",
  Artisanat: "bg-moroccan-ochre text-accent-foreground",
  Muse: "bg-moroccan-terracotta text-primary-foreground",
  "Palais & Muse": "bg-moroccan-terracotta text-primary-foreground",
  Place: "bg-moroccan-green-light text-primary-foreground",
  "Mausole & Mosque": "bg-primary/80 text-primary-foreground",
  Forteresse: "bg-moroccan-blue-light text-primary-foreground",
  Zaoua: "bg-secondary/90 text-secondary-foreground",
  Zaouia: "bg-secondary/90 text-secondary-foreground",
  Fondouk: "bg-moroccan-blue-light text-primary-foreground",
  "Maison traditionnelle": "bg-moroccan-green-light text-primary-foreground",
  Jardin: "bg-moroccan-green-light text-primary-foreground",
  Palais: "bg-moroccan-terracotta text-primary-foreground",
};

const monumentMaps: Record<string, MapConfig> = {
  "Mosque Al Quaraouiyine": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.1788237017468!2d-4.9733667!3d34.064929899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff359c4e30d3f%3A0x8614a8beafd0df83!2sMosqu%C3%A9e%20et%20Universit%C3%A9%20Karaouiyne!5e0!3m2!1sfr!2sma!4v1771095606280!5m2!1sfr!2sma",
  },
  "Mdersa Bou Inania": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3305.2821094603573!2d-4.9854216!3d34.0622818!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff4af477e648d%3A0x957eb0f34b372714!2sM%C3%A9dersa%20Bou%20Inania%20de%20F%C3%A8s!5e0!3m2!1sfr!2sma!4v1771111179687!5m2!1sfr!2sma",
  },
  "Tanneries Chouara": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.135459286517!2d-4.975892749603597!3d34.06604164800118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff391122c8bdf%3A0x21a8c7fe5f3dbd4e!2sTannerie%20Chouara!5e0!3m2!1sfr!2sma!4v1771096063933!5m2!1sfr!2sma",
  },
  "Muse Nejjarine": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.1855591984913!2d-4.978484988518081!3d34.06475721695711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff3581109a683%3A0x6a46e59966ccb7bf!2sFondouk%20Nejjarine!5e0!3m2!1sfr!2sma!4v1771096095794!5m2!1sfr!2sma",
  },
  "Mausole de Moulay Idriss II": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.1818876212487!2d-4.979587549603911!3d34.06485134806537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff312db5277c1%3A0x2958a56987fabcab!2sMausol%C3%A9e%20de%20Moulay%20Idriss%20II!5e0!3m2!1sfr!2sma!4v1771096174931!5m2!1sfr!2sma",
  },
  "Place Seffarine": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.1818876212487!2d-4.979587549603911!3d34.06485134806537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff359dfd40ff1%3A0x166cc10f0b6fe712!2sPlace%20Seffarine!5e0!3m2!1sfr!2sma!4v1771096217303!5m2!1sfr!2sma",
  },
  "Mdersa Al-Attarine": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.171203141798!2d-4.9761914242829866!3d34.06512527315204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff359ca2f5575%3A0x694d0781fb7d3f1f!2sM%C3%A9dersa%20Attarine!5e0!3m2!1sfr!2sma!4v1771118278891!5m2!1sfr!2sma",
  },
  "Muse Batha": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.364090259367!2d-4.983066899999999!3d34.0601798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff4aed90b70d3%3A0xc44a61c2c91a5c87!2sMus%C3%A9e%20batha!5e0!3m2!1sfr!2sma!4v1771156528030!5m2!1sfr!2sma",
  },
  "Borj Nord": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.0873183142967!2d-4.987513088518!3d34.06727581682398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff4a4f182a245%3A0x1fa05b327717df71!2sBorj%20Nord!5e0!3m2!1sfr!2sma!4v1771156593971!5m2!1sfr!2sma",
  },
  "Zaouia Sidi Ahmed Tijani": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13220.498844445885!2d-4.983701629411644!3d34.066317197622226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b688fd6c767%3A0x9bd424c537944bf6!2sMausol%C3%A9e%20de%20Sidi%20Ahmed%20al-Tijani!5e0!3m2!1sfr!2sma!4v1771118369859!5m2!1sfr!2sma",
  },
  "Porte du Palais Royal de Fs": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.6360412968315!2d-4.996201988518437!3d34.05320611756727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff4b527b09711%3A0x3e0d1029255008bd!2sPalais%20Royal!5e0!3m2!1sfr!2sma!4v1771156638030!5m2!1sfr!2sma",
  },
  "Jardin Jnan Sbil": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13221.548549324909!2d-4.99856847941542!3d34.059588849073926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff4ae09473177%3A0xd1011727d6b18241!2sJnan%20Sbil!5e0!3m2!1sfr!2sma!4v1771118562315!5m2!1sfr!2sma",
  },
  "Mosque des Andalous": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13220.978565667523!2d-4.978406479413356!3d34.063242448285656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff35068cd206f%3A0xdea6a68a05525019!2sMosqu%C3%A9e%20des%20Andalous!5e0!3m2!1sfr!2sma!4v1771118595825!5m2!1sfr!2sma",
  },
  "Palais Mnebhi": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13221.014292629246!2d-4.9892320794135!3d34.063013448335056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9ff52eaa402c79%3A0xade74880bbfeb8bb!2sPalais%20Mnebhi!5e0!3m2!1sfr!2sma!4v1771118632409!5m2!1sfr!2sma",
  },
};

const monuments: Monument[] = [
  {
    name: "Mosque Al Quaraouiyine",
    category: "Mosque",
    description:
      "Fondee en 859, c'est l'une des plus anciennes universites du monde encore en activite, et un joyau de l'architecture islamique.",
    hours: "Visible de l'exterieur",
    duration: "30 min",
    image: mosqueeAlKaraouine,
    details: [
      "  voir : salle de priere monumentale, bibliotheque historique, zellige et bois sculpte.",
      " Acces : interieur reserve aux musulmans.",
      " Horaires : visible pendant les prieres.",
      " Lieu : quartier central de la mdina.",
    ],
  },
  {
    name: "Mdersa Bou Inania",
    category: "Mdersa & Mosque",
    description:
      "Chef-d'oeuvre merinide (1351-1356), ornee de zellige, de stuc sculpte et de bois de cedre.",
    hours: "9h - 17h",
    duration: "45 min",
    image: ecoleBounania,
    details: [
      "  voir : patio central, fontaine, boiseries et stucs finement sculptes.",
      " Acces : interieur reserve aux musulmans. Prix d'entree general : 10 dh.",
      " Horaires : 8h-18h.",
      " Duree : 15-30 min.",
      " Lieu : rue Talaa Kebira, mdina.",
    ],
  },
  {
    name: "Tanneries Chouara",
    category: "Artisanat",
    description:
      "Parmi les plus anciennes tanneries du monde, ou le cuir est traite selon des methodes ancestrales.",
    hours: "8h - 18h",
    duration: "1h",
    image: tannerie,
    details: [
      "  voir : bacs de teinture, processus artisanal, terrasses d'observation.",
      " Odeur forte, prevoir un foulard.",
      " Duree : 15-45 min.",
      " Lieu : quartier Blida, mdina.",
    ],
  },
  {
    name: "Muse Nejjarine",
    category: "Muse",
    description:
      "Ancien fondouk restaure, dedie aux arts et metiers du bois, avec une terrasse panoramique.",
    hours: "10h - 17h",
    duration: "1h",
    image: museeNejjarin,
    details: [
      "  voir : architecture traditionnelle, fontaine Nejjarine, artisanat du bois.",
      " Acces : ouvert aux visiteurs. Prix d'entree general : 20 dh.",
      " Horaires : 10h-17h.",
      " Duree : 30-70 min.",
      " Lieu : place Nejjarine, mdina.",
    ],
  },
  {
    name: "Mausole de Moulay Idriss II",
    category: "Mausole & Mosque",
    description:
      "Lieu spirituel majeur dedie au fondateur de Fes, remarquable par son architecture raffinee.",
    hours: "Journee",
    duration: "30 min",
    image: myIdriss,
    details: [
      "  voir : porte monumentale, zellige, stuc et ambiance spirituelle.",
      " Acces : interieur reserve aux musulmans.",
      " Duree : 15-20 min.",
      " Lieu : quartier central, prs de la place Seffarine.",
    ],
  },
  {
    name: "Place Seffarine",
    category: "Place",
    description:
      "Place historique celebre pour ses dinandiers et son ambiance artisanale unique.",
    hours: "Acces libre",
    duration: "20 min",
    image: seffarine,
    details: [
      "  voir : ateliers de cuivre, ambiance sonore, fontaine centrale.",
      " Horaires : acces libre.",
      " Duree : 10-20 min.",
      " Lieu : prs de la Mdersa Seffarine.",
    ],
  },
  {
    name: "Mdersa Al-Attarine",
    category: "Mdersa",
    description:
      "Ecole coranique merinide du XIVe siecle, connue pour ses zelliges et son bois sculpte d'une grande finesse.",
    hours: "9h - 17h",
    duration: "30 min",
    image: attarin,
    details: [
      "  voir : cour interieure, zellige fin, stuc sculpte, bois cisele.",
      " Acces : interieur reserve aux musulmans. Prix d'entree general : 20 dh.",
      " Horaires : 9h-17h.",
      " Lieu : prs de la place Seffarine, mdina de Fs.",
    ],
  },
  {
    name: "Muse Batha",
    category: "Muse",
    description:
      "Ancien palais royal transforme en musee des arts traditionnels marocains, avec un magnifique jardin andalou.",
    hours: "10h - 18h",
    duration: "45 min",
    image: darBatha,
    details: [
      "  voir : collections d'art marocain, ceramiques, tapis, jardin andalou.",
      " Acces : ouvert aux visiteurs. Prix d'entree general : 60 dh.",
      " Horaires : 10h-18h.",
      " Lieu : avenue des Mrinides, Fs.",
    ],
  },
  {
    name: "Borj Nord",
    category: "Forteresse",
    description:
      "Forteresse saadienne offrant une vue panoramique exceptionnelle sur toute la medina.",
    hours: "9h - 18h",
    duration: "45 min",
    image: borjNord,
    details: [
      "  voir : panorama sur la mdina, musee des armes, architecture militaire.",
      " Acces : ouvert aux visiteurs. Prix d'entree general : 10 dh.",
      " Horaires : de 9h-12h et de 15h-18h.",
      " Lieu : Oued Fejjaline, 5 Ave du Batha, Fs.",
    ],
  },
  {
    name: "Zaouia Sidi Ahmed Tijani",
    category: "Mausole & Mosque",
    description:
      "Lieu spirituel majeur de la confrerie Tijania, visite par des fideles du monde entier.",
    hours: "Visible depuis l'exterieur",
    duration: "20-30 min",
    image: zaouiaSidiAhmedTijani,
    details: [
      "  voir : mausole, salle de prire, dcorations islamiques.",
      " Acces : interieur reserve aux musulmans.",
      " Horaires : visible depuis l'exterieur.",
      " Lieu : Rue Tafilalete, mdina de Fs.",
    ],
  },
  {
    name: "Porte du Palais Royal de Fs",
    category: "Palais",
    description:
      "Entree officielle du Palais Royal, elle est l'un des symboles architecturaux les plus impressionnants de Fes, melant artisanat traditionnel marocain et grandeur royale.",
    hours: "Visible depuis l'exterieur toute la journee",
    duration: "20-30 min",
    image: portePalais,
    details: [
      "  voir : sept portes monumentales en bronze dor, zellige vert, mosaques et bois sculpt.",
      " Acces : interieur du palais ferme au public.",
      " Horaires : visible depuis l'exterieur toute la journee.",
      " Lieu : place des Alaouites, Fs Jdid.",
    ],
  },
  {
    name: "Jardin Jnan Sbil",
    category: "Jardin",
    description:
      "Jardin historique entre Fes Jdid et la medina, apprecie pour ses allees ombragees et ses fontaines.",
    hours: "8h - 19h",
    duration: "20-30 min",
    image: jnanSbil,
    details: [
      "  voir : jardins andalous, fontaines, allees ombragees.",
      " Acces : ouvert au public (gratuit).",
      " Horaires : 8h-19h.",
      " Lieu : entre Fs Jdid et la mdina.",
    ],
  },
  {
    name: "Mosque des Andalous",
    category: "Mosque",
    description:
      "Mosquee historique fondee au IXe siecle, symbole des origines de Fes.",
    hours: "Visible pendant les prieres",
    duration: "15 min",
    image: mosqueAndalous,
    details: [
      "  voir : minaret, salle de priere, architecture andalouse.",
      " Acces : interieur reserve aux musulmans.",
      " Horaires : visible pendant les prieres.",
      " Lieu : quartier des Andalous, mdina de Fs.",
    ],
  },
  {
    name: "Palais Mnebhi",
    category: "Palais",
    description: "Palais historique connu pour ses patios, ses jardins, son stuc et son zellige decoratif.",
    hours: "10h - 16h",
    duration: "15-25 min",
    image: palaisMnebhi,
    details: [
      "  voir : patios, jardins, stuc et zellige decoratif.",
      " Acces : ouvert aux visiteurs (selon disponibilite et reservation).",
      " Horaires : 10h-16h.",
      " Lieu : Rue Souiket Ben Safi, mdina de Fs.",
    ],
  },
];

const HeritageSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openMonumentName, setOpenMonumentName] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_MONUMENTS);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);

  const filteredMonuments = useMemo(
    () =>
      monuments.filter((monument) => {
        if (categoryFilter === ALL_CATEGORIES) {
          return true;
        }

        if (categoryFilter === "mosquee_mausolee") {
          return (
            monument.category === "Mosque" ||
            monument.category === "Mausole & Mosque" ||
            monument.category === "Mdersa & Mosque"
          );
        }

        if (categoryFilter === "medersa") {
          return monument.category === "Mdersa" || monument.category === "Mdersa & Mosque";
        }

        return monument.category === categoryFilter;
      }),
    [categoryFilter],
  );

  const selectedMonument = openMonumentName
    ? monuments.find((monument) => monument.name === openMonumentName) ?? null
    : null;
  const selectedMap = selectedMonument ? monumentMaps[selectedMonument.name] : null;
  const visibleMonuments = filteredMonuments.slice(0, visibleCount);
  const hasMoreMonuments = visibleCount < filteredMonuments.length;

  useEffect(() => {
    if (openMonumentName === null) {
      setMapReady(false);
      return;
    }

    const timer = window.setTimeout(() => setMapReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [openMonumentName]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_MONUMENTS);
    setOpenMonumentName(null);
  }, [categoryFilter]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredMonuments.length));
  };

  return (
    <section id="patrimoine" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16"
        >
          <div className="mb-5 flex justify-end">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-moroccan-ochre/30 bg-gradient-to-r from-card to-moroccan-sand/20 px-3 py-2 shadow-sm backdrop-blur-sm">
              <SlidersHorizontal size={16} className="text-moroccan-ochre-dark" />
              <span className="font-body text-sm font-semibold text-foreground">Trier</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  aria-label="Trier par catgorie"
                  className="h-9 min-w-[220px] border-moroccan-ochre/30 bg-background/80 font-body text-sm"
                >
                  <SelectValue placeholder="Choisir une catgorie" />
                </SelectTrigger>
                <SelectContent className="border-moroccan-ochre/30 bg-card">
                  {categoryFilters.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-body text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">Guide Touristique</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Patrimoine de la Mdina</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Explorez les trsors architecturaux et culturels d'une ville qui a travers 12 sicles d'histoire.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleMonuments.map((m, i) => (
            <motion.div
              key={m.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.06, duration: 0.3 }}
              className="group bg-card rounded-xl overflow-hidden shadow-moroccan hover:shadow-lg transition-shadow border border-border cursor-pointer"
              onClick={() => setOpenMonumentName(m.name)}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  fetchPriority="auto"
                  decoding="async"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryColors[m.category] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{m.name}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{m.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {m.hours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} /> {m.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> Mdina
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMoreMonuments && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center rounded-lg bg-muted px-6 py-3 font-body text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              Voir plus de monuments
            </button>
          </div>
        )}

        {openMonumentName !== null && selectedMonument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
            <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in">
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-muted hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                onClick={() => setOpenMonumentName(null)}
                aria-label="Fermer"
                tabIndex={0}
              >
                <X size={22} />
              </button>

              <img src={selectedMonument.image} alt={selectedMonument.name} className="w-full h-56 object-cover rounded-t-2xl" />

              <div
                className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-moroccan-ochre scrollbar-track-muted rounded-b-2xl touch-pan-y"
                style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
              >
                <h3 className="font-heading text-2xl font-bold mb-2 text-foreground">{selectedMonument.name}</h3>

                {selectedMap?.linkUrl ? (
                  <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3 text-center">
                    <a
                      href={selectedMap.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm font-semibold text-primary underline"
                    >
                      Ouvrir la carte Google Maps
                    </a>
                  </div>
                ) : null}

                {selectedMap?.embedUrl ? (
                  <div className="mb-4 flex justify-center">
                    {!mapReady ? (
                      <div className="h-[200px] w-[320px] animate-pulse rounded-lg bg-muted" aria-label="Chargement de la carte" />
                    ) : (
                      <iframe
                        src={selectedMap.embedUrl}
                        width="320"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Carte ${selectedMonument.name}`}
                      />
                    )}
                  </div>
                ) : null}

                <ul className="font-body text-base text-muted-foreground space-y-1 mb-2">
                  {selectedMonument.details.map((d, idx) => (
                    <li key={`${selectedMonument.name}-${idx}`}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeritageSection;
