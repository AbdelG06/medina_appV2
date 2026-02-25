import belghaImage from "../assets/belgha.JPG";
import caftanImage from "../assets/caftan.jpg";
import chebakiaImage from "../assets/chebakia.JPG";
import epicesImage from "../assets/epices.jpg";
import poterieImage from "../assets/poterie.JPG";
import seffarineImage from "../assets/seffarine.jpg";
import tapisImage from "../assets/Tapis.jpg";

export type LocalizedText = {
  fr: string;
  ar: string;
};

export type ShopItem = {
  id: string;
  category: LocalizedText;
  name: LocalizedText;
  artisanName: LocalizedText;
  artisanAddress: LocalizedText;
  phone?: string;
  price: string;
  description: LocalizedText;
  image: string;
};

export const shopItems: ShopItem[] = [
  {
    id: "plateau-cuivre-seffarine",
    category: { fr: "Ceramique et metal", ar: "الخزف والمعادن" },
    name: { fr: "Plateau en cuivre cisele", ar: "صينية نحاسية منقوشة" },
    artisanName: { fr: "Maitre Ahmed", ar: "المعلم أحمد" },
    artisanAddress: { fr: "Place Seffarine, Medina de Fes", ar: "ساحة الصفارين، المدينة العتيقة فاس" },
    price: "350 MAD",
    description: {
      fr: "Plateau decoratif grave a la main avec des motifs geometriques traditionnels.",
      ar: "صينية زخرفية منقوشة يدويا بزخارف هندسية تقليدية.",
    },
    image: seffarineImage,
  },
  {
    id: "poterie-senhaji-youness",
    category: { fr: "Ceramique et metal", ar: "الخزف والمعادن" },
    name: { fr: "Poterie artisanale de Fes", ar: "خزف فاسي تقليدي" },
    artisanName: { fr: "Senhaji Youness", ar: "سنهجي يونس" },
    artisanAddress: { fr: "Talaa Sghira, Medina de Fes", ar: "طالعة الصغيرة، المدينة العتيقة فاس" },
    phone: "+212 614 848 982",
    price: "A partir de 120 MAD",
    description: {
      fr: "Pieces en argile faconnees et emaillees a la main, inspirees des formes patrimoniales de Fes.",
      ar: "قطع فخارية مشغولة ومزججة يدويا مستوحاة من تراث فاس.",
    },
    image: poterieImage,
  },
  {
    id: "babouches-cuir",
    category: { fr: "Artisanat du cuir", ar: "صناعة الجلد التقليدية" },
    name: { fr: "Babouches en cuir", ar: "بلغة جلدية تقليدية" },
    artisanName: { fr: "Hassan El Fassi", ar: "حسن الفاسي" },
    artisanAddress: { fr: "Souk Sabbaghin, Medina de Fes", ar: "سوق الصباغين، المدينة العتيقة فاس" },
    phone: "+212 6 62 11 33 20",
    price: "150 MAD",
    description: {
      fr: "Babouches souples en cuir naturel, couture et finition faites a la main.",
      ar: "بلغة مرنة من الجلد الطبيعي بخياطة وتشطيب يدوي.",
    },
    image: belghaImage,
  },
  {
    id: "epices-attarine",
    category: { fr: "Epices et produits locaux", ar: "توابل ومنتجات محلية" },
    name: { fr: "Melange d'epices du souk", ar: "خلطة توابل من السوق" },
    artisanName: { fr: "Epicerie El Attarine", ar: "عطارة العطارين" },
    artisanAddress: { fr: "Quartier Attarine, Fes el-Bali", ar: "حي العطارين، فاس البالي" },
    phone: "+212 6 70 31 45 88",
    price: "30 MAD / sachet",
    description: {
      fr: "Melange maison pour tajines, couscous et grillades, prepare quotidiennement.",
      ar: "خلطة منزلية للطاجين والكسكس والمشاوي يتم تحضيرها يوميا.",
    },
    image: epicesImage,
  },
  {
    id: "tapis-ain-nokbi",
    category: { fr: "Souvenirs et textile", ar: "تذكارات ونسيج" },
    name: { fr: "Tapis berbere", ar: "زرابي أمازيغية" },
    artisanName: { fr: "Cooperative Ain Nokbi", ar: "تعاونية عين النقبي" },
    artisanAddress: { fr: "Ain Nokbi, route de Sefrou, Fes", ar: "عين النقبي، طريق صفرو، فاس" },
    phone: "+212 6 66 00 71 23",
    price: "1200 MAD",
    description: {
      fr: "Tapis noue main en laine naturelle avec motifs traditionnels.",
      ar: "زرابي منسوجة يدويا من صوف طبيعي بزخارف تقليدية.",
    },
    image: tapisImage,
  },
  {
    id: "caftan-brode",
    category: { fr: "Souvenirs et textile", ar: "تذكارات ونسيج" },
    name: { fr: "Caftan brode", ar: "قفطان مطرز" },
    artisanName: { fr: "Atelier Fassi", ar: "مشغل فاسي" },
    artisanAddress: { fr: "Derb el-Henna, Medina de Fes", ar: "درب الحناء، المدينة العتيقة فاس" },
    phone: "+212 6 61 08 54 14",
    price: "2500 MAD",
    description: {
      fr: "Caftan en soie et broderie traditionnelle, coupe sur mesure.",
      ar: "قفطان من الحرير بتطريز تقليدي وخياطة حسب المقاس.",
    },
    image: caftanImage,
  },
  {
    id: "chebakia-medina",
    category: { fr: "Epices et produits locaux", ar: "توابل ومنتجات محلية" },
    name: { fr: "Chebakia artisanale", ar: "شباكية تقليدية" },
    artisanName: { fr: "Patisserie La Medina", ar: "حلويات المدينة" },
    artisanAddress: { fr: "Rue Talaa Kebira, Medina de Fes", ar: "طالعة الكبيرة، المدينة العتيقة فاس" },
    phone: "+212 5 35 74 22 81",
    price: "60 MAD / boite",
    description: {
      fr: "Patisserie marocaine au sesame et au miel, preparee chaque matin.",
      ar: "حلوى مغربية بالسمسم والعسل تحضر يوميا كل صباح.",
    },
    image: chebakiaImage,
  },
];
