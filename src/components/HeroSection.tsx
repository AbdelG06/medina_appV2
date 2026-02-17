import heroImg from "@/assets/Boujloud2.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Vue panoramique de la médina de Fès"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="font-body text-moroccan-cream/80 text-sm uppercase tracking-[0.3em] mb-4">
            Patrimoine Mondial UNESCO
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-moroccan-cream mb-6 leading-tight">
            Fès el-Bali
          </h1>
          <p className="font-heading text-xl md:text-2xl text-moroccan-cream/90 italic max-w-2xl mx-auto mb-4">
            La plus ancienne médina du monde
          </p>
          <p className="font-body text-base md:text-lg text-moroccan-cream/70 max-w-xl mx-auto mb-10">
            Fondée au VIIIe siècle, la médina de Fès est un labyrinthe vivant de 9 400 ruelles,
            gardienne de 12 siècles d'histoire, d'artisanat et de spiritualité.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#patrimoine"
            className="inline-block px-8 py-3 bg-moroccan-gradient text-primary-foreground font-body font-semibold rounded-lg shadow-moroccan hover:opacity-90 transition-opacity"
          >
            Explorer le Patrimoine
          </a>
          <a
            href="#circuits"
            className="inline-block px-8 py-3 border-2 border-moroccan-cream/40 text-moroccan-cream font-body font-semibold rounded-lg hover:bg-moroccan-cream/10 transition-colors"
          >
            Voir les Circuits
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0 80V40C360 0 720 0 720 0C720 0 1080 0 1440 40V80H0Z"
            fill="hsl(38, 33%, 96%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
