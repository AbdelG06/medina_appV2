export type ProductPriceRange = {
  id: string;
  product: {
    fr: string;
    ar: string;
  };
  minDh: number;
  maxDh: number;
  notes: {
    fr: string;
    ar: string;
  };
};

export type CulturalTerm = {
  term: string;
  definition: {
    fr: string;
    ar: string;
  };
};

export const productPriceRanges: ProductPriceRange[] = [
  {
    id: "babouches",
    product: { fr: "Babouches en cuir", ar: "بلغة جلدية" },
    minDh: 30,
    maxDh: 120,
    notes: {
      fr: "Depend de la qualite du cuir, de la finition et de la couture.",
      ar: "السعر يعتمد على جودة الجلد والتشطيب ونوع الخياطة.",
    },
  },
  {
    id: "sac-cuir",
    product: { fr: "Sac en cuir artisanal", ar: "حقيبة جلد تقليدية" },
    minDh: 120,
    maxDh: 400,
    notes: {
      fr: "Verifier l'epaisseur du cuir et la robustesse des coutures.",
      ar: "تحقق من سماكة الجلد وقوة الخياطة.",
    },
  },
  {
    id: "zellige",
    product: { fr: "Carreau de zellige", ar: "قطعة زليج" },
    minDh: 8,
    maxDh: 45,
    notes: {
      fr: "Le prix varie selon la coupe, la taille et la complexite du motif.",
      ar: "الثمن يتغير حسب المقاس والتقطيع وتعقيد النقش.",
    },
  },
  {
    id: "plateau-cuivre",
    product: { fr: "Plateau cuivre cisele", ar: "صينية نحاس منقوشة" },
    minDh: 140,
    maxDh: 700,
    notes: {
      fr: "Le travail manuel detaille augmente legitmement le prix.",
      ar: "النقش اليدوي المفصل يرفع السعر بشكل طبيعي.",
    },
  },
  {
    id: "tapis",
    product: { fr: "Tapis artisanal", ar: "زربية تقليدية" },
    minDh: 500,
    maxDh: 3500,
    notes: {
      fr: "Le prix depend de la taille, la laine et le temps de tissage.",
      ar: "السعر مرتبط بالحجم ونوع الصوف ومدة النسج.",
    },
  },
];

export const culturalTerms: CulturalTerm[] = [
  {
    term: "Riad",
    definition: {
      fr: "Maison traditionnelle organisee autour d'un patio central, souvent avec fontaine ou jardin.",
      ar: "دار تقليدية تتمحور حول صحن داخلي غالبا مع نافورة أو حديقة.",
    },
  },
  {
    term: "Medersa",
    definition: {
      fr: "Etablissement historique d'enseignement religieux et scientifique dans la ville ancienne.",
      ar: "مؤسسة تعليمية تاريخية للعلوم الدينية والمعرفية داخل المدينة القديمة.",
    },
  },
  {
    term: "Zellige",
    definition: {
      fr: "Mosaïque geometrique realisee a partir de pieces de faience taillees a la main.",
      ar: "فسيفساء هندسية تُصنع من قطع خزفية مقطعة يدويا.",
    },
  },
  {
    term: "Fondouk",
    definition: {
      fr: "Ancien caravanserail servant d'accueil, de stockage et d'echange pour les marchands.",
      ar: "خان تاريخي كان مخصصا لإيواء التجار وتخزين السلع والتبادل التجاري.",
    },
  },
];
