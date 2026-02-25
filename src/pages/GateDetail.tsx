import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Navigation, Route, MessageCircle } from "lucide-react";
import { getGateBySlug } from "@/data/gates";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";

const GateDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const gate = getGateBySlug(slug || "");
  const { language, t } = useAppSettings();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!gate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">{t("Porte introuvable", "Porte introuvable")}</h1>
          <Link to="/#portes" className="text-primary underline font-body">
            {t("Retour aux portes", "Retour aux portes")}
          </Link>
        </div>
      </div>
    );
  }

  const gateName = language === "ar" ? gate.name.ar : gate.name.fr;
  const gateDate = language === "ar" ? gate.date.ar : gate.date.fr;
  const gateDescription = language === "ar" ? gate.description.ar : gate.description.fr;
  const suggestedCircuit = language === "ar" ? gate.suggestedCircuit.ar : gate.suggestedCircuit.fr;

  const getMapsLink = (lat: number, lng: number) =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={gate.photo} alt={gateName} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <motion.button
            initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/#portes")}
            className="flex items-center gap-2 text-moroccan-cream/80 hover:text-moroccan-cream font-body text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> {t("Retour aux portes", "Retour aux portes")}
          </motion.button>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1, duration: 0.4 }}
          >
            <p className="font-body text-moroccan-cream/60 text-sm mb-1">{gateDate}</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-moroccan-cream mb-3">{gateName}</h1>
            <p className="font-body text-moroccan-cream/80 max-w-2xl text-base md:text-lg leading-relaxed">{gateDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Patrimoine a proximite", "Patrimoine a proximite")}</h2>
            <p className="font-body text-muted-foreground">{t(`Decouvrez les tresors situes pres de ${gate.name.fr}.`, `????? ??????? ??????? ?? ${gate.name.ar}.`)}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {gate.heritage.map((h, i) => {
              const heritageName = language === "ar" ? h.name.ar : h.name.fr;
              const heritageDescription = language === "ar" ? h.description.ar : h.description.fr;
              return (
                <motion.div
                  key={h.name.fr}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.08, duration: 0.4 }}
                  onClick={() => window.open(getMapsLink(h.lat, h.lng), "_blank", "noopener,noreferrer")}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      window.open(getMapsLink(h.lat, h.lng), "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-moroccan transition-shadow cursor-pointer"
                >
                  <div className="relative h-48">
                    <img src={h.photo} alt={heritageName} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{heritageName}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{heritageDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-primary" /> {h.visitTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-primary" /> {h.distance}
                      </span>
                    </div>
                    <a
                      href={getMapsLink(h.lat, h.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-moroccan-gradient text-primary-foreground font-body font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Navigation size={16} /> {t("Voir sur Google Maps", "??? ??? ????? Google")}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="font-body text-sm text-muted-foreground mb-1">{t("Circuit suggere depuis cette porte", "Circuit suggere depuis cette porte")}</p>
              <p className="font-heading text-lg font-bold text-foreground">
                {suggestedCircuit} - {gate.circuitDuration}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/#circuits"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Route size={16} /> {t("Ajouter au circuit", "Ajouter au circuit")}
              </Link>
              <button
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-background text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors"
              >
                <MessageCircle size={16} /> {t("Demander au chatbot", "Demander au chatbot")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default GateDetail;
