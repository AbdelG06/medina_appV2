export type QuizQuestion = {
  id: string;
  question: {
    fr: string;
    ar: string;
  };
  options: Array<{
    fr: string;
    ar: string;
  }>;
  correctIndex: number;
  explanation: {
    fr: string;
    ar: string;
  };
};

export const quizBank: QuizQuestion[] = [
  {
    id: "q1",
    question: {
      fr: "Quelle medina est classee au patrimoine mondial de l'UNESCO depuis 1981 ?",
      ar: "اي مدينة قديمة مصنفة تراثا عالميا لليونسكو منذ 1981؟",
    },
    options: [
      { fr: "Meknes", ar: "مكناس" },
      { fr: "Medina de Fes", ar: "مدينة فاس العتيقة" },
      { fr: "Chefchaouen", ar: "شفشاون" },
      { fr: "Marrakech Guéliz", ar: "مراكش جيليز" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "La medina de Fes el-Bali est classee UNESCO depuis 1981.",
      ar: "مدينة فاس البالي مصنفة ضمن اليونسكو منذ 1981.",
    },
  },
  {
    id: "q2",
    question: {
      fr: "Quel monument est considere comme l'une des plus anciennes universites actives du monde ?",
      ar: "أي معلمة تعتبر من أقدم الجامعات المستمرة في العالم؟",
    },
    options: [
      { fr: "Medersa Bou Inania", ar: "مدرسة بو عنانية" },
      { fr: "Mosquee Al Quaraouiyine", ar: "جامع القرويين" },
      { fr: "Dar Batha", ar: "دار البطحاء" },
      { fr: "Borj Nord", ar: "برج الشمال" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Al Quaraouiyine est celebre pour son role universitaire historique.",
      ar: "القرويين مشهورة بدورها الجامعي التاريخي.",
    },
  },
  {
    id: "q3",
    question: {
      fr: "Dans quel quartier peut-on observer les tanneries traditionnelles de Fes ?",
      ar: "في أي حي يمكن مشاهدة المدابغ التقليدية في فاس؟",
    },
    options: [
      { fr: "Quartier Chouara", ar: "حي الشوارة" },
      { fr: "Fes Jdid", ar: "فاس الجديد" },
      { fr: "Ville Nouvelle", ar: "المدينة الجديدة" },
      { fr: "Mellah", ar: "الملاح" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Les tanneries Chouara sont les plus connues de la medina.",
      ar: "مدابغ الشوارة هي الأشهر في المدينة القديمة.",
    },
  },
  {
    id: "q4",
    question: {
      fr: "Quel artisanat est emblematique de la place Seffarine ?",
      ar: "ما هو الحرف التقليدي المميز لساحة الصفارين؟",
    },
    options: [
      { fr: "Menuiserie", ar: "النجارة" },
      { fr: "Dinanderie (cuivre)", ar: "النحاس التقليدي" },
      { fr: "Tissage du tapis", ar: "نسج الزرابي" },
      { fr: "Cuir maroquinerie", ar: "صناعة الجلد" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Seffarine est reputee pour les ateliers de cuivre.",
      ar: "ساحة الصفارين معروفة بورشات صناعة النحاس.",
    },
  },
  {
    id: "q5",
    question: {
      fr: "La medersa Al-Attarine date principalement de quelle periode ?",
      ar: "إلى أي فترة يعود تاريخ مدرسة العطارين أساسا؟",
    },
    options: [
      { fr: "Periode merinide", ar: "العصر المريني" },
      { fr: "Periode almohade", ar: "العصر الموحدي" },
      { fr: "Periode saadienne", ar: "العصر السعدي" },
      { fr: "Periode alaouite", ar: "العصر العلوي" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Al-Attarine est un chef-d'oeuvre merinide.",
      ar: "مدرسة العطارين تحفة من العصر المريني.",
    },
  },
  {
    id: "q6",
    question: {
      fr: "Quel lieu offre une vue panoramique sur la medina depuis les hauteurs ?",
      ar: "أي موقع يمنح إطلالة بانورامية على المدينة من الأعلى؟",
    },
    options: [
      { fr: "Borj Nord", ar: "برج الشمال" },
      { fr: "Bab Boujloud", ar: "باب بوجلود" },
      { fr: "Fondouk Nejjarine", ar: "فندق النجارين" },
      { fr: "Jnan Sbil", ar: "جنان السبيل" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Borj Nord domine la ville et offre un panorama large.",
      ar: "برج الشمال يطل على المدينة بمنظر واسع.",
    },
  },
  {
    id: "q7",
    question: {
      fr: "Quel jardin historique relie Fes Jdid et la medina ?",
      ar: "أي حديقة تاريخية تقع بين فاس الجديد والمدينة القديمة؟",
    },
    options: [
      { fr: "Jnan Sbil", ar: "جنان السبيل" },
      { fr: "Ain Azliten", ar: "عين أزليتن" },
      { fr: "Parc Champ de Course", ar: "بارك شامب دو كورس" },
      { fr: "Jardin Atlas", ar: "حديقة الأطلس" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Jnan Sbil est un jardin emblematique de Fes.",
      ar: "جنان السبيل حديقة رمزية في فاس.",
    },
  },
  {
    id: "q8",
    question: {
      fr: "Quel est l'element decoratif marocain compose de petites pieces de faience ?",
      ar: "ما اسم الزخرفة المغربية المكونة من قطع خزفية صغيرة؟",
    },
    options: [
      { fr: "Tadelakt", ar: "التدلاكت" },
      { fr: "Zellige", ar: "الزليج" },
      { fr: "Jabador", ar: "جلابة" },
      { fr: "Moucharabieh", ar: "مشربية" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Le zellige est l'un des symboles artistiques de Fes.",
      ar: "الزليج من أبرز رموز الفن التقليدي في فاس.",
    },
  },
  {
    id: "q9",
    question: {
      fr: "Quel quartier est historiquement associe aux portes monumentales de Fes Jdid ?",
      ar: "أي حي يرتبط تاريخيا بالأبواب الضخمة لفاس الجديد؟",
    },
    options: [
      { fr: "Fes Jdid", ar: "فاس الجديد" },
      { fr: "Ville Nouvelle", ar: "المدينة الجديدة" },
      { fr: "Sefrou", ar: "صفرو" },
      { fr: "Taza", ar: "تازة" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Les grandes portes royales se trouvent surtout a Fes Jdid.",
      ar: "الأبواب الملكية الكبرى توجد أساسا في فاس الجديد.",
    },
  },
  {
    id: "q10",
    question: {
      fr: "Quel lieu est celebre pour les artisans du bois et son fondouk restaure ?",
      ar: "أي مكان معروف بحرفيي الخشب وفندقه التاريخي المُرمم؟",
    },
    options: [
      { fr: "Musee Nejjarine", ar: "متحف النجارين" },
      { fr: "Bab Rcif", ar: "باب الرصيف" },
      { fr: "Bab Ftouh", ar: "باب الفتوح" },
      { fr: "Mellah", ar: "الملاح" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "Nejjarine met en valeur les arts du bois et l'architecture du fondouk.",
      ar: "النجارين يبرز فنون الخشب وعمارة الفندق التاريخي.",
    },
  },
  {
    id: "q11",
    question: {
      fr: "Pour une visite confortable de la medina, quel moment est souvent recommande ?",
      ar: "لزيارة مريحة للمدينة القديمة، ما الوقت الأنسب غالبا؟",
    },
    options: [
      { fr: "Milieu d'apres-midi en ete", ar: "منتصف بعد الظهر صيفا" },
      { fr: "Tot le matin ou fin d'apres-midi", ar: "الصباح الباكر أو آخر النهار" },
      { fr: "Uniquement la nuit", ar: "فقط ليلا" },
      { fr: "Pendant les heures les plus chaudes", ar: "خلال أشد ساعات الحر" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Les ruelles sont plus agreables en dehors des pics de chaleur.",
      ar: "الأزقة تكون ألطف خارج ذروة الحرارة.",
    },
  },
  {
    id: "q12",
    question: {
      fr: "Quel role joue la medina de Fes dans l'economie locale ?",
      ar: "ما دور مدينة فاس العتيقة في الاقتصاد المحلي؟",
    },
    options: [
      { fr: "Faible impact", ar: "تأثير ضعيف" },
      { fr: "Centre artisanal, touristique et culturel majeur", ar: "مركز رئيسي للصناعة التقليدية والسياحة والثقافة" },
      { fr: "Zone industrielle moderne", ar: "منطقة صناعية حديثة" },
      { fr: "Uniquement administrative", ar: "دور إداري فقط" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Elle soutient l'artisanat, l'emploi local et l'attractivite touristique.",
      ar: "هي تدعم الحرف التقليدية وفرص الشغل والجاذبية السياحية.",
    },
  },
  {
    id: "q13",
    question: {
      fr: "Quel type de batiment designe le mot 'fondouk' a Fes ?",
      ar: "ماذا يعني لفظ 'فندق/فندوك' في فاس؟",
    },
    options: [
      { fr: "Un jardin", ar: "حديقة" },
      { fr: "Un ancien caravanserail pour marchands", ar: "خان تاريخي للتجار" },
      { fr: "Une porte de ville", ar: "باب من أبواب المدينة" },
      { fr: "Une forteresse", ar: "قلعة" },
    ],
    correctIndex: 1,
    explanation: {
      fr: "Le fondouk servait de lieu d'accueil, stockage et commerce.",
      ar: "الفندوك كان فضاء للإيواء والتخزين والتجارة.",
    },
  },
  {
    id: "q14",
    question: {
      fr: "Quel monument est connu pour ses portes dorees impressionnantes ?",
      ar: "أي معلمة مشهورة بأبوابها الذهبية المهيبة؟",
    },
    options: [
      { fr: "Porte du Palais Royal", ar: "بوابة القصر الملكي" },
      { fr: "Bab Guissa", ar: "باب الكيسة" },
      { fr: "Bab Mahrouk", ar: "باب المحروق" },
      { fr: "Bab Ftouh", ar: "باب الفتوح" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "La porte du Palais Royal est un symbole architectural fort.",
      ar: "بوابة القصر الملكي من أبرز الرموز المعمارية.",
    },
  },
  {
    id: "q15",
    question: {
      fr: "Quel style d'experience est typique d'une visite guidee dans la medina ?",
      ar: "ما التجربة الشائعة في جولة مرافقة داخل المدينة القديمة؟",
    },
    options: [
      { fr: "Parcours entre souks, monuments et ateliers", ar: "مسار بين الأسواق والمعالم والورش" },
      { fr: "Tour uniquement en autoroute", ar: "جولة عبر الطريق السيار فقط" },
      { fr: "Visite sans marche", ar: "زيارة بدون مشي" },
      { fr: "Aucune interaction locale", ar: "دون أي تفاعل محلي" },
    ],
    correctIndex: 0,
    explanation: {
      fr: "L'experience repose sur les ruelles, artisans et patrimoine vivant.",
      ar: "التجربة تقوم على الأزقة والحرفيين والتراث الحي.",
    },
  },
];

export const pickQuizQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...quizBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
