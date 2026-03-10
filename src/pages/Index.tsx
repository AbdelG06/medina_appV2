import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HeritageSection from "../components/HeritageSection";
import Footer from "../components/Footer";

const GatesSection = lazy(() => import("../components/GatesSection"));
const CircuitsSection = lazy(() => import("../components/CircuitsSection"));
const ShopSection = lazy(() => import("../components/ShopSection"));
const CityLifeSection = lazy(() => import("../components/CityLifeSection"));
const EmergencyMapSection = lazy(() => import("../components/EmergencyMapSection"));

const SectionFallback = ({ id }: { id: string }) => (
  <section id={id} className="py-16">
    <div className="container mx-auto px-4">
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
    </div>
  </section>
);

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    let tries = 0;
    const maxTries = 20;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.clearInterval(timer);
      } else if (tries >= maxTries) {
        window.clearInterval(timer);
      }
      tries += 1;
    }, 80);

    return () => window.clearInterval(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HeritageSection />
      <Suspense fallback={<SectionFallback id="portes" />}>
        <GatesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="circuits" />}>
        <CircuitsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="boutique" />}>
        <ShopSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="citylife" />}>
        <CityLifeSection />
      </Suspense>
      <Suspense fallback={<SectionFallback id="urgence-map" />}>
        <EmergencyMapSection />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
