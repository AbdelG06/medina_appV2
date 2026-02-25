import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gates } from "@/data/gates";
import BabBoujloud from "./gate-illustrations/BabBoujloud";
import BabFtouh from "./gate-illustrations/BabFtouh";
import BabGuissa from "./gate-illustrations/BabGuissa";
import BabRcif from "./gate-illustrations/BabRcif";
import BabMahrouk from "./gate-illustrations/BabMahrouk";
import BabChorfa from "./gate-illustrations/BabChorfa";
import BabSemmarine from "./gate-illustrations/BabSemmarine";
import BabDekkakin from "./gate-illustrations/BabDekkakin";
import BabElHadid from "./gate-illustrations/BabElHadid";
import BabJdid from "./gate-illustrations/BabJdid";
import BabElKhokha from "./gate-illustrations/BabElKhokha";
import BabSegma from "./gate-illustrations/BabSegma";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentType } from "react";
import { useAppSettings } from "@/contexts/AppSettingsContext";

const gateIllustrations: Record<string, ComponentType<{ className?: string }>> = {
  "bab-boujloud": BabBoujloud,
  "bab-ftouh": BabFtouh,
  "bab-guissa": BabGuissa,
  "bab-rcif": BabRcif,
  "bab-mahrouk": BabMahrouk,
  "bab-chorfa": BabChorfa,
  "bab-semmarine": BabSemmarine,
  "bab-dekkakin": BabDekkakin,
  "bab-el-hadid": BabElHadid,
  "bab-jdid": BabJdid,
  "bab-makina": BabElKhokha,
  "bab-segma": BabSegma,
};

const GateCard = ({ gate, index }: { gate: (typeof gates)[0]; index: number }) => {
  const navigate = useNavigate();
  const { language, t } = useAppSettings();
  const Illustration = gateIllustrations[gate.slug];
  const gateName = language === "ar" ? gate.name.ar : gate.name.fr;
  const gateDate = language === "ar" ? gate.date.ar : gate.date.fr;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={() => navigate(`/porte/${gate.slug}`)}
      className="group relative cursor-pointer focus:outline-none"
      aria-label={t(`Decouvrir ${gate.name.fr}`, `????? ${gate.name.ar}`)}
    >
      <div className="relative w-full max-w-[260px] mx-auto">
        <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-moroccan transition-shadow duration-500">
          {Illustration && <Illustration className="w-full h-auto" />}
          <div className="absolute inset-0 bg-moroccan-gold/0 group-hover:bg-moroccan-gold/10 transition-all duration-500 pointer-events-none" />
          <div className="absolute inset-0 origin-left bg-foreground/0 group-hover:bg-foreground/15 transition-all duration-700 group-hover:[transform:perspective(800px)_rotateY(-15deg)] pointer-events-none" />
        </div>

        <div className="mt-4 text-center">
          <div className="inline-block px-5 py-2 bg-card border border-border rounded-lg shadow-sm group-hover:shadow-moroccan transition-shadow duration-300">
            <span className="font-heading text-sm md:text-base font-bold text-foreground">{gateName}</span>
            <span className="block font-body text-xs text-muted-foreground mt-0.5">{gateDate}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

const GatesSection = () => {
  const { t } = useAppSettings();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="portes" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            {t("Portes Historiques", "Portes Historiques")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("Parmi les 12 Portes de la Medina de Fes", "?? ??? 12 ???? ?? ????? ??? ???????")}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            {t("Chaque porte est une entree vers un monde de decouvertes. Cliquez pour explorer.", "?? ??? ?? ???? ????? ?? ??????????. ???? ?????????.")}
          </p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {gates.map((gate, i) => (
                <div
                  key={gate.slug}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] px-2"
                >
                  <GateCard gate={gate} index={i} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-card border-2 border-moroccan-gold/30 hover:border-moroccan-gold hover:bg-moroccan-gold/10 text-foreground rounded-full p-3 shadow-lg transition-all duration-300 z-10 group"
            aria-label={t("Porte precedente", "Porte precedente")}
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card border-2 border-moroccan-gold/30 hover:border-moroccan-gold hover:bg-moroccan-gold/10 text-foreground rounded-full p-3 shadow-lg transition-all duration-300 z-10 group"
            aria-label={t("Porte suivante", "Porte suivante")}
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-moroccan-gold w-8" : "bg-moroccan-gold/30 hover:bg-moroccan-gold/50"
                }`}
                aria-label={t(`Aller a la diapositive ${index + 1}`, `?????? ??? ??????? ${index + 1}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatesSection;
