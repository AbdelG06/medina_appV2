import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HeritageSection from "../components/HeritageSection";
import GatesSection from "../components/GatesSection";
import CircuitsSection from "../components/CircuitsSection";
import ShopSection from "../components/ShopSection";
import CityLifeSection from "../components/CityLifeSection";
import EmergencyMapSection from "../components/EmergencyMapSection";
import Footer from "../components/Footer";


const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HeritageSection />
      <GatesSection />
      <CircuitsSection />
      <ShopSection />
      <CityLifeSection />
      <EmergencyMapSection />
      <Footer />
    </div>
  );
};

export default Index;
