import babBoujloud from "../assets/bab-boujloud.jpg";
import babFtouh from "../assets/Bab_Ftouh.jpg";
import babGuissa from "../assets/bab_guissa.jpg";
import babRcif from "../assets/bab_rcif.jpg";
import babMahrouk from "../assets/bab_mahrouk.jpg";
import babChorfa from "../assets/bab_chorfa.jpg";
import boujloud2 from "../assets/Boujloud2.jpg";
import heroFez from "../assets/hero-fez.jpg";
import portePalais from "../assets/Porte_palais.jpg";

import ecoleBounania from "../assets/ecole_bounania.jpg";
import darBatha from "../assets/Dar-batha.jpg";
import tannerie from "../assets/tannerie.jpg";
import museeNejjarine from "../assets/musee-nejjarine.jpg";
import mosqueAndalous from "../assets/Mosque_andalous.jpg";
import seffarine from "../assets/seffarine.jpg";
import attarin from "../assets/attarin.jpg";
import borjNord from "../assets/Borj_nord.jpg";
import myIdriss from "../assets/my-idriss.jpg";
import mosqueeAlKaraouine from "../assets/mosquee-al-karaouine.jpg";
import jnanSbil from "../assets/Jnan_Sbil.jpg";
import zaouiaSidiAhmedTijani from "../assets/Zaouia-Sidi-Ahmed-Tijani.jpg";
import palaisMnebhi from "../assets/palais_mnebhi.jpg";

export interface Heritage {
  name: string;
  description: string;
  photo: string;
  visitTime: string;
  distance: string;
  lat: number;
  lng: number;
}

export interface GateData {
  slug: string;
  name: string;
  date: string;
  photo: string;
  description: string;
  heritage: Heritage[];
  suggestedCircuit: string;
  circuitDuration: string;
}

export const gates: GateData[] = [
  {
    slug: "bab-boujloud",
    name: "Bab Boujloud",
    date: "Construite en 1913",
    photo: babBoujloud,
    description:
      "La porte emblématique aux zellige bleus et verts, entrée principale de Fès el-Bali. Côté extérieur, elle arbore le bleu de Fès, et côté intérieur, le vert de l'Islam. C'est le point de départ idéal pour explorer la médina.",
    heritage: [
      {
        name: "Médersa Bou Inania",
        description:
          "Chef-d'œuvre mérinide (1351-1356), ornée de zellige, stuc sculpté et bois de cèdre.",
        photo: ecoleBounania,
        visitTime: "45 min",
        distance: "150 m",
        lat: 34.0622818,
        lng: -4.9854216,
      },
      {
        name: "Musée Batha",
        description:
          "Ancien palais royal transformé en musée des arts traditionnels marocains, avec un magnifique jardin andalou.",
        photo: darBatha,
        visitTime: "45 min",
        distance: "200 m",
        lat: 34.0601798,
        lng: -4.9830669,
      },
    ],
    suggestedCircuit: "Circuit Historique",
    circuitDuration: "90 min",
  },
  {
    slug: "bab-ftouh",
    name: "Bab Ftouh",
    date: "XIIe siècle",
    photo: babFtouh,
    description:
      "La 'Porte de la Conquête', située au sud de la médina. Elle mène vers le plus grand cimetière de Fès et offre une perspective unique sur l'histoire militaire des dynasties marocaines.",
    heritage: [
      {
        name: "Mosquée des Andalous",
        description: "Mosquée historique fondée au IXe siècle, symbole des origines de Fès.",
        photo: mosqueAndalous,
        visitTime: "15 min",
        distance: "400 m",
        lat: 34.0632424,
        lng: -4.9784065,
      },
      {
        name: "Tanneries Chouara",
        description:
          "Les plus anciennes tanneries du monde, où le cuir est traité selon des méthodes ancestrales.",
        photo: tannerie,
        visitTime: "1h",
        distance: "300 m",
        lat: 34.0660416,
        lng: -4.9758927,
      },
    ],
    suggestedCircuit: "Circuit Spirituel",
    circuitDuration: "120 min",
  },
  {
    slug: "bab-guissa",
    name: "Bab Guissa",
    date: "XIIe siècle",
    photo: babGuissa,
    description:
      "Porte nord surplombant la médina, offrant une vue panoramique spectaculaire sur Fès el-Bali. à proximité se trouve le célèbre Palais Jamai, transformé en hôtel de luxe.",
    heritage: [
      {
        name: "Borj Nord",
        description:
          "Forteresse saadienne offrant une vue panoramique exceptionnelle sur toute la médina.",
        photo: borjNord,
        visitTime: "45 min",
        distance: "500 m",
        lat: 34.0672758,
        lng: -4.9875131,
      },
      {
        name: "Musée Batha",
        description:
          "Ancien palais royal transformé en musée des arts traditionnels marocains, avec un magnifique jardin andalou.",
        photo: darBatha,
        visitTime: "45 min",
        distance: "1,4 km",
        lat: 34.0601798,
        lng: -4.9830669,
      },
    ],
    suggestedCircuit: "Circuit Historique",
    circuitDuration: "90 min",
  },
  {
    slug: "bab-rcif",
    name: "Bab Rcif",
    date: "XIIe siècle",
    photo: babRcif,
    description:
      "Porte donnant accès au quartier commerçant le plus animé de la médina. Le quartier Rcif est célèbre pour son marché aux épices, ses souks de produits frais et son atmosphère vibrante.",
    heritage: [
      {
        name: "Place Seffarine",
        description:
          "Place historique célèbre pour ses dinandiers et son ambiance artisanale unique.",
        photo: seffarine,
        visitTime: "20 min",
        distance: "450 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
      {
        name: "Tanneries Chouara",
        description:
          "Les plus anciennes tanneries du monde, où le cuir est traité selon des méthodes ancestrales.",
        photo: tannerie,
        visitTime: "1h",
        distance: "300 m",
        lat: 34.0660416,
        lng: -4.9758927,
      },
    ],
    suggestedCircuit: "Circuit Artisanal",
    circuitDuration: "150 min",
  },
  {
    slug: "bab-mahrouk",
    name: "Bab Mahrouk",
    date: "XIIIe siècle",
    photo: babMahrouk,
    description:
      "Porte historique proche de la forteresse nord. Son nom, signifiant 'la Brûlée', rappelle qu'on y exposait autrefois les têtes des criminels. Elle offre un accès direct au Borj Nord.",
    heritage: [
      {
        name: "Borj Nord",
        description:
          "Forteresse saadienne offrant une vue panoramique exceptionnelle sur toute la médina.",
        photo: borjNord,
        visitTime: "45 min",
        distance: "200 m",
        lat: 34.0672758,
        lng: -4.9875131,
      },
      {
        name: "Jardin Jnan Sbil",
        description:
          "Jardin historique entre Fès Jdid et la médina, apprécié pour ses allées ombragées et ses fontaines.",
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "1,5 km",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: "Circuit Historique",
    circuitDuration: "120 min",
  },
  {
    slug: "bab-chorfa",
    name: "Bab Chorfa",
    date: "XIVe siècle",
    photo: babChorfa,
    description:
      "La 'Porte des Nobles', menant au mausolée du fondateur spirituel de Fès, Moulay Idriss II. C'est l'un des accès les plus vénérés de la médina, emprunté par les pèlerins depuis des siècles.",
    heritage: [
      {
        name: "Mausolée de Moulay Idriss II",
        description:
          "Lieu spirituel majeur, dédié au fondateur de Fès, à l'architecture raffinée.",
        photo: myIdriss,
        visitTime: "30 min",
        distance: "100 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
      {
        name: "Mosquée Al Quaraouiyine",
        description:
          "Fondée en 859, considérée comme la plus ancienne université du monde. Un joyau de l'architecture islamique.",
        photo: mosqueeAlKaraouine,
        visitTime: "30 min",
        distance: "250 m",
        lat: 34.0649299,
        lng: -4.9733667,
      },
    ],
    suggestedCircuit: "Circuit Spirituel",
    circuitDuration: "90 min",
  },
  {
    slug: "bab-semmarine",
    name: "Bab Semmarine",
    date: "XIIe siècle",
    photo: boujloud2,
    description:
      "La 'Porte des Brossiers', nommée d'après le souk traditionnel des fabricants de selles et de harnais. Point d'entrée stratégique vers le quartier artisanal de la médina.",
    heritage: [
      {
        name: "Médersa Al-Attarine",
        description:
          "École coranique mérinide du XIVe siècle, connue pour ses zelliges et son bois sculpté d'une grande finesse.",
        photo: attarin,
        visitTime: "30 min",
        distance: "300 m",
        lat: 34.0651253,
        lng: -4.9761914,
      },
      {
        name: "Place Seffarine",
        description:
          "Place historique célèbre pour ses dinandiers et son ambiance artisanale unique.",
        photo: seffarine,
        visitTime: "20 min",
        distance: "350 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
    ],
    suggestedCircuit: "Circuit Artisanal",
    circuitDuration: "110 min",
  },
  {
    slug: "bab-dekkakin",
    name: "Bab Dekkakin",
    date: "XIIe siècle",
    photo: heroFez,
    description:
      "La 'Porte des Bancs', autrefois entourée de marchands ambulants installés sur des bancs. Elle marque l'entrée du quartier résidentiel traditionnel de la médina.",
    heritage: [
      {
        name: "Musée Nejjarine",
        description:
          "Ancien fondouk restauré, dédié aux arts et métiers du bois avec terrasse panoramique.",
        photo: museeNejjarine,
        visitTime: "1h",
        distance: "250 m",
        lat: 34.0647572,
        lng: -4.978485,
      },
      {
        name: "Place Seffarine",
        description:
          "Place historique célèbre pour ses dinandiers et son ambiance artisanale unique.",
        photo: seffarine,
        visitTime: "20 min",
        distance: "300 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
    ],
    suggestedCircuit: "Circuit Historique",
    circuitDuration: "100 min",
  },
  {
    slug: "bab-el-hadid",
    name: "Bab El Hadid",
    date: "XIIIe siècle",
    photo: portePalais,
    description:
      "La 'Porte de Fer', impressionnante par ses dimensions et ses portes massives en fer forgé. Elle servait autrefois de poste de contrôle principal pour les marchandises entrant dans la ville.",
    heritage: [
      {
        name: "Porte du Palais Royal de Fès",
        description:
          "Entrée officielle du Palais Royal, l'un des symboles architecturaux les plus impressionnants de Fès, mêlant artisanat traditionnel marocain et grandeur royale.",
        photo: portePalais,
        visitTime: "20 min",
        distance: "400 m",
        lat: 34.0532061,
        lng: -4.9962019,
      },
      {
        name: "Jardin Jnan Sbil",
        description:
          "Jardin historique entre Fès Jdid et la médina, apprécié pour ses allées ombragées et ses fontaines.",
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "1,1 km",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: "Circuit Historique",
    circuitDuration: "130 min",
  },
  {
    slug: "bab-jdid",
    name: "Bab Jdid",
    date: "XVIe siècle",
    photo: portePalais,
    description:
      "La 'Porte Nouvelle', construite par les Saadiens. Bien que 'nouvelle' en comparaison, elle a plus de 500 ans d'histoire et ouvre sur Fès el-Jdid, la ville nouvelle médiévale.",
    heritage: [
      {
        name: "Palais Mnebhi",
        description: "Palais historique connu pour ses patios, jardins, stuc et zellige décoratif.",
        photo: palaisMnebhi,
        visitTime: "25 min",
        distance: "900 m",
        lat: 34.0630134,
        lng: -4.9892321,
      },
      {
        name: "Jardin Jnan Sbil",
        description:
          "Jardin historique entre Fès Jdid et la médina, apprécié pour ses allées ombragées et ses fontaines.",
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "700 m",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: "Circuit Promenade",
    circuitDuration: "120 min",
  },
  {
    slug: "bab-makina",
    name: "Bab Makina",
    date: "XIIe siècle",
    photo: heroFez,
    description:
      "Petite porte discrète mais stratégique, son nom signifie 'petite ouverture'. Elle offre un accès direct aux quartiers résidentiels authentiques, loin des circuits touristiques.",
    heritage: [
      {
        name: "Musée Nejjarine",
        description:
          "Ancien fondouk restauré, dédié aux arts et métiers du bois avec terrasse panoramique.",
        photo: museeNejjarine,
        visitTime: "1h",
        distance: "220 m",
        lat: 34.0647572,
        lng: -4.978485,
      },
      {
        name: "Mosquée Al Quaraouiyine",
        description:
          "Fondée en 859, considérée comme la plus ancienne université du monde. Un joyau de l'architecture islamique.",
        photo: mosqueeAlKaraouine,
        visitTime: "30 min",
        distance: "350 m",
        lat: 34.0649299,
        lng: -4.9733667,
      },
    ],
    suggestedCircuit: "Circuit Artisanal",
    circuitDuration: "95 min",
  },
  {
    slug: "bab-segma",
    name: "Bab Segma",
    date: "XIIe siècle",
    photo: heroFez,
    description:
      "Porte orientale de la médina donnant accès au quartier andalou. Son architecture massive témoigne de l'importance stratégique de cette entrée dans le système défensif de Fès.",
    heritage: [
      {
        name: "Mosquée des Andalous",
        description: "Mosquée historique fondée au IXe siècle, symbole des origines de Fès.",
        photo: mosqueAndalous,
        visitTime: "15 min",
        distance: "450 m",
        lat: 34.0632424,
        lng: -4.9784065,
      },
      {
        name: "Zaouia Sidi Ahmed Tijani",
        description:
          "Lieu spirituel majeur de la confrérie Tijania, visité par des fidèles du monde entier.",
        photo: zaouiaSidiAhmedTijani,
        visitTime: "30 min",
        distance: "650 m",
        lat: 34.0663172,
        lng: -4.9837016,
      },
    ],
    suggestedCircuit: "Circuit Spirituel",
    circuitDuration: "105 min",
  },
];

export function getGateBySlug(slug: string): GateData | undefined {
  return gates.find((g) => g.slug === slug);
}
