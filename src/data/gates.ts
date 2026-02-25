import boujloud2 from "../assets/Boujloud2.jpg";
import babFtouh from "../assets/Bab_Ftouh.jpg";
import babGuissa from "../assets/bab_guissa.jpg";
import babRcif from "../assets/bab_rcif.jpg";
import babMahrouk from "../assets/bab_mahrouk.jpg";
import babChorfa from "../assets/bab_chorfa.jpg";
import babSemmarine from "../assets/bab-semmarin.jpg";
import babDekkakin from "../assets/bab-dekkakin.jpg";
import babElHadid from "../assets/bab-elhadid.jpg";
import babJdid from "../assets/bab-jdid.jpg";
import babMakina from "../assets/Bab_makina.jpg";
import babSegma from "../assets/bab-segma.jpg";

import ecoleBounania from "../assets/ecole_bounania.jpg";
import darBatha from "../assets/dar-roumana.jpg";
import tannerie from "../assets/tannerie.JPG";
import museeNejjarine from "../assets/musee-nejjarine.JPG";
import mosqueAndalous from "../assets/Mosque_andalous.jpg";
import seffarine from "../assets/seffarine.jpg";
import attarin from "../assets/attarin.jpg";
import borjNord from "../assets/Borj_nord.jpg";
import myIdriss from "../assets/my-idriss.JPG";
import mosqueeAlKaraouine from "../assets/mosquee-al-karaouine.PNG";
import jnanSbil from "../assets/Jnan_Sbil.jpg";
import zaouiaSidiAhmedTijani from "../assets/Zaouia-Sidi-Ahmed-Tijani.jpg";
import palaisMnebhi from "../assets/palais_mnebhi.jpg";
import portePalais from "../assets/Porte_palais.jpg";

export type LocalizedText = {
  fr: string;
  ar: string;
};

export interface Heritage {
  name: LocalizedText;
  description: LocalizedText;
  photo: string;
  visitTime: string;
  distance: string;
  lat: number;
  lng: number;
}

export interface GateData {
  slug: string;
  name: LocalizedText;
  date: LocalizedText;
  photo: string;
  description: LocalizedText;
  heritage: Heritage[];
  suggestedCircuit: LocalizedText;
  circuitDuration: string;
}

export const gates: GateData[] = [
  {
    slug: "bab-boujloud",
    name: { fr: "Bab Boujloud", ar: "Bab Boujloud" },
    date: { fr: "Construite en 1913", ar: "???? ??? 1913" },
    photo: boujloud2,
    description: {
      fr: "Porte iconique en zellige bleu et vert, principale entree vers Fes el-Bali.",
      ar: "????? ????? ????? ???? ?????? ??? ?????? ??????? ??? ??? ??????.",
    },
    heritage: [
      {
        name: { fr: "Medersa Bou Inania", ar: "Medersa Bou Inania" },
        description: {
          fr: "Chef-d'oeuvre merinide au decor de zellige, stuc et bois cisele.",
          ar: "???? ?????? ?????? ?????? ????? ?????? ???????.",
        },
        photo: ecoleBounania,
        visitTime: "45 min",
        distance: "150 m",
        lat: 34.0622818,
        lng: -4.9854216,
      },
      {
        name: { fr: "Musee Batha", ar: "Musee Batha" },
        description: {
          fr: "Ancien palais royal converti en musee des arts traditionnels.",
          ar: "??? ???? ???? ???? ??? ???? ?????? ?????????.",
        },
        photo: darBatha,
        visitTime: "45 min",
        distance: "200 m",
        lat: 34.0601798,
        lng: -4.9830669,
      },
    ],
    suggestedCircuit: { fr: "Circuit Historique", ar: "Circuit Historique" },
    circuitDuration: "90 min",
  },
  {
    slug: "bab-ftouh",
    name: { fr: "Bab Ftouh", ar: "Bab Ftouh" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babFtouh,
    description: {
      fr: "Porte sud historique menant vers des quartiers anciens et des cimetieres majeurs.",
      ar: "????? ?????? ??????? ???? ??? ????? ????? ?????? ????.",
    },
    heritage: [
      {
        name: { fr: "Mosquee des Andalous", ar: "Mosquee des Andalous" },
        description: { fr: "Mosquee fondee au IXe siecle, symbole des origines de Fes.", ar: "???? ??? ?? ????? ??????? ??? ?????? ???." },
        photo: mosqueAndalous,
        visitTime: "15 min",
        distance: "400 m",
        lat: 34.0632424,
        lng: -4.9784065,
      },
      {
        name: { fr: "Tanneries Chouara", ar: "Tanneries Chouara" },
        description: { fr: "Tanneries historiques actives depuis des siecles.", ar: "????? ??????? ???? ??? ????." },
        photo: tannerie,
        visitTime: "1h",
        distance: "300 m",
        lat: 34.0660416,
        lng: -4.9758927,
      },
    ],
    suggestedCircuit: { fr: "Circuit Spirituel", ar: "Circuit Spirituel" },
    circuitDuration: "120 min",
  },
  {
    slug: "bab-guissa",
    name: { fr: "Bab Guissa", ar: "Bab Guissa" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babGuissa,
    description: {
      fr: "Porte nord offrant une belle vue sur la medina et ses remparts.",
      ar: "????? ?????? ???? ?????? ????? ??? ??????? ????????.",
    },
    heritage: [
      {
        name: { fr: "Borj Nord", ar: "Borj Nord" },
        description: { fr: "Forteresse avec panorama exceptionnel sur Fes.", ar: "??? ??????? ????????? ????? ??? ???." },
        photo: borjNord,
        visitTime: "45 min",
        distance: "500 m",
        lat: 34.0672758,
        lng: -4.9875131,
      },
      {
        name: { fr: "Musee Batha", ar: "Musee Batha" },
        description: { fr: "Musee d'arts traditionnels avec jardin andalou.", ar: "???? ?????? ????????? ?? ????? ???????." },
        photo: darBatha,
        visitTime: "45 min",
        distance: "1.4 km",
        lat: 34.0601798,
        lng: -4.9830669,
      },
    ],
    suggestedCircuit: { fr: "Circuit Historique", ar: "Circuit Historique" },
    circuitDuration: "90 min",
  },
  {
    slug: "bab-rcif",
    name: { fr: "Bab Rcif", ar: "Bab Rcif" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babRcif,
    description: {
      fr: "Acces direct a un quartier commercant tres anime de la medina.",
      ar: "???? ????? ??? ?? ????? ???? ??????? ???? ???????.",
    },
    heritage: [
      {
        name: { fr: "Place Seffarine", ar: "Place Seffarine" },
        description: { fr: "Place celebre pour le travail du cuivre.", ar: "???? ?????? ?????? ??????." },
        photo: seffarine,
        visitTime: "20 min",
        distance: "450 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
      {
        name: { fr: "Tanneries Chouara", ar: "Tanneries Chouara" },
        description: { fr: "Ateliers de cuir traditionnels en activite.", ar: "??? ??????? ??????? ????? ?? ???? ????." },
        photo: tannerie,
        visitTime: "1h",
        distance: "300 m",
        lat: 34.0660416,
        lng: -4.9758927,
      },
    ],
    suggestedCircuit: { fr: "Circuit Artisanal", ar: "Circuit Artisanal" },
    circuitDuration: "150 min",
  },
  {
    slug: "bab-mahrouk",
    name: { fr: "Bab Mahrouk", ar: "Bab Mahrouk" },
    date: { fr: "XIIIe siecle", ar: "????? 13" },
    photo: babMahrouk,
    description: {
      fr: "Porte historique pres des hauteurs nord de la medina.",
      ar: "????? ??????? ??? ????????? ???????? ???????.",
    },
    heritage: [
      {
        name: { fr: "Borj Nord", ar: "Borj Nord" },
        description: { fr: "Forteresse saadienne avec vue large.", ar: "???? ????? ??????? ?????." },
        photo: borjNord,
        visitTime: "45 min",
        distance: "200 m",
        lat: 34.0672758,
        lng: -4.9875131,
      },
      {
        name: { fr: "Jardin Jnan Sbil", ar: "Jardin Jnan Sbil" },
        description: { fr: "Jardin historique apprecie pour ses allees ombragees.", ar: "????? ??????? ?? ????? ????? ?????." },
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "1.5 km",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: { fr: "Circuit Historique", ar: "Circuit Historique" },
    circuitDuration: "120 min",
  },
  {
    slug: "bab-chorfa",
    name: { fr: "Bab Chorfa", ar: "Bab Chorfa" },
    date: { fr: "XIVe siecle", ar: "????? 14" },
    photo: babChorfa,
    description: {
      fr: "Porte associee aux parcours spirituels de la medina.",
      ar: "????? ?????? ????????? ??????? ???? ???????.",
    },
    heritage: [
      {
        name: { fr: "Mausolee de Moulay Idriss II", ar: "Mausolee de Moulay Idriss II" },
        description: { fr: "Lieu spirituel majeur de la ville de Fes.", ar: "???? ???? ????? ?? ????? ???." },
        photo: myIdriss,
        visitTime: "30 min",
        distance: "100 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
      {
        name: { fr: "Mosquee Al Quaraouiyine", ar: "Mosquee Al Quaraouiyine" },
        description: { fr: "Monument religieux et intellectuel fonde en 859.", ar: "???? ???? ????? ???? ??? 859." },
        photo: mosqueeAlKaraouine,
        visitTime: "30 min",
        distance: "250 m",
        lat: 34.0649299,
        lng: -4.9733667,
      },
    ],
    suggestedCircuit: { fr: "Circuit Spirituel", ar: "Circuit Spirituel" },
    circuitDuration: "90 min",
  },
  {
    slug: "bab-semmarine",
    name: { fr: "Bab Semmarine", ar: "Bab Semmarine" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babSemmarine,
    description: {
      fr: "Porte reliee a des zones artisanales traditionnelles.",
      ar: "????? ?????? ???????? ??????? ?????????.",
    },
    heritage: [
      {
        name: { fr: "Medersa Al-Attarine", ar: "Medersa Al-Attarine" },
        description: { fr: "Ecole merinide celebre pour son decor raffine.", ar: "????? ?????? ?????? ???????? ???????." },
        photo: attarin,
        visitTime: "30 min",
        distance: "300 m",
        lat: 34.0651253,
        lng: -4.9761914,
      },
      {
        name: { fr: "Place Seffarine", ar: "Place Seffarine" },
        description: { fr: "Ateliers de cuivre et ambiance locale forte.", ar: "????? ?????? ?????? ????? ?????." },
        photo: seffarine,
        visitTime: "20 min",
        distance: "350 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
    ],
    suggestedCircuit: { fr: "Circuit Artisanal", ar: "Circuit Artisanal" },
    circuitDuration: "110 min",
  },
  {
    slug: "bab-dekkakin",
    name: { fr: "Bab Dekkakin", ar: "Bab Dekkakin" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babDekkakin,
    description: {
      fr: "Porte proche d'axes de circulation historiques de Fes Jdid.",
      ar: "????? ????? ?? ????? ??????? ?????? ?? ??? ??????.",
    },
    heritage: [
      {
        name: { fr: "Musee Nejjarine", ar: "Musee Nejjarine" },
        description: { fr: "Fondouk restaure dedie aux arts du bois.", ar: "???? ?????? ???? ???? ????? ?????." },
        photo: museeNejjarine,
        visitTime: "1h",
        distance: "250 m",
        lat: 34.0647572,
        lng: -4.978485,
      },
      {
        name: { fr: "Place Seffarine", ar: "Place Seffarine" },
        description: { fr: "Place artisanale animee.", ar: "???? ????? ????? ???????." },
        photo: seffarine,
        visitTime: "20 min",
        distance: "300 m",
        lat: 34.0648513,
        lng: -4.9795875,
      },
    ],
    suggestedCircuit: { fr: "Circuit Historique", ar: "Circuit Historique" },
    circuitDuration: "100 min",
  },
  {
    slug: "bab-el-hadid",
    name: { fr: "Bab El Hadid", ar: "Bab El Hadid" },
    date: { fr: "XIIIe siecle", ar: "????? 13" },
    photo: babElHadid,
    description: {
      fr: "Porte monumentale et repere fort des abords du palais royal.",
      ar: "????? ???? ????? ???? ??? ????? ??????.",
    },
    heritage: [
      {
        name: { fr: "Porte du Palais Royal", ar: "Porte du Palais Royal" },
        description: { fr: "Ensemble monumental au decor artisanal impressionnant.", ar: "????? ????? ???? ?????? ??????? ?????." },
        photo: portePalais,
        visitTime: "20 min",
        distance: "400 m",
        lat: 34.0532061,
        lng: -4.9962019,
      },
      {
        name: { fr: "Jardin Jnan Sbil", ar: "Jardin Jnan Sbil" },
        description: { fr: "Jardin public historique entre Fes Jdid et la medina.", ar: "????? ??????? ??? ??? ?????? ???????? ???????." },
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "1.1 km",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: { fr: "Circuit Historique", ar: "Circuit Historique" },
    circuitDuration: "130 min",
  },
  {
    slug: "bab-jdid",
    name: { fr: "Bab Jdid", ar: "Bab Jdid" },
    date: { fr: "XVIe siecle", ar: "????? 16" },
    photo: babJdid,
    description: {
      fr: "Porte historique de Fes Jdid et point de passage vers les jardins.",
      ar: "????? ??????? ?? ??? ?????? ???? ??? ???????.",
    },
    heritage: [
      {
        name: { fr: "Palais Mnebhi", ar: "Palais Mnebhi" },
        description: { fr: "Palais connu pour ses patios et son zellige.", ar: "??? ????? ??????? ?????? ????????." },
        photo: palaisMnebhi,
        visitTime: "25 min",
        distance: "900 m",
        lat: 34.0630134,
        lng: -4.9892321,
      },
      {
        name: { fr: "Jardin Jnan Sbil", ar: "Jardin Jnan Sbil" },
        description: { fr: "Espace vert historique et paisible.", ar: "???? ???? ?????? ?????." },
        photo: jnanSbil,
        visitTime: "30 min",
        distance: "700 m",
        lat: 34.0595888,
        lng: -4.9985685,
      },
    ],
    suggestedCircuit: { fr: "Circuit Promenade", ar: "Circuit Promenade" },
    circuitDuration: "120 min",
  },
  {
    slug: "bab-makina",
    name: { fr: "Bab Makina", ar: "Bab Makina" },
    date: { fr: "XIXe siecle", ar: "????? 19" },
    photo: babMakina,
    description: {
      fr: "Porte liee aux espaces ceremoniels et culturels de Fes Jdid.",
      ar: "????? ?????? ????????? ???????? ??????????? ?? ??? ??????.",
    },
    heritage: [
      {
        name: { fr: "Musee Nejjarine", ar: "Musee Nejjarine" },
        description: { fr: "Collection remarquable autour des arts du bois.", ar: "??????? ????? ??? ???? ?????." },
        photo: museeNejjarine,
        visitTime: "1h",
        distance: "220 m",
        lat: 34.0647572,
        lng: -4.978485,
      },
      {
        name: { fr: "Mosquee Al Quaraouiyine", ar: "Mosquee Al Quaraouiyine" },
        description: { fr: "Monument majeur de l'histoire religieuse de Fes.", ar: "???? ????? ?? ??????? ?????? ?????? ???." },
        photo: mosqueeAlKaraouine,
        visitTime: "30 min",
        distance: "350 m",
        lat: 34.0649299,
        lng: -4.9733667,
      },
    ],
    suggestedCircuit: { fr: "Circuit Artisanal", ar: "Circuit Artisanal" },
    circuitDuration: "95 min",
  },
  {
    slug: "bab-segma",
    name: { fr: "Bab Segma", ar: "Bab Segma" },
    date: { fr: "XIIe siecle", ar: "????? 12" },
    photo: babSegma,
    description: {
      fr: "Porte orientale reliant les quartiers andalous de la medina.",
      ar: "????? ????? ??? ??? ??????? ????????? ???? ???????.",
    },
    heritage: [
      {
        name: { fr: "Mosquee des Andalous", ar: "Mosquee des Andalous" },
        description: { fr: "Mosquee historique fondee au IXe siecle.", ar: "???? ?????? ???? ?? ????? ??????." },
        photo: mosqueAndalous,
        visitTime: "15 min",
        distance: "450 m",
        lat: 34.0632424,
        lng: -4.9784065,
      },
      {
        name: { fr: "Zaouia Sidi Ahmed Tijani", ar: "Zaouia Sidi Ahmed Tijani" },
        description: { fr: "Lieu spirituel de reference pour la Tijania.", ar: "???? ???? ????? ??????? ?????????." },
        photo: zaouiaSidiAhmedTijani,
        visitTime: "30 min",
        distance: "650 m",
        lat: 34.0663172,
        lng: -4.9837016,
      },
    ],
    suggestedCircuit: { fr: "Circuit Spirituel", ar: "Circuit Spirituel" },
    circuitDuration: "105 min",
  },
];

export function getGateBySlug(slug: string): GateData | undefined {
  return gates.find((g) => g.slug === slug);
}
