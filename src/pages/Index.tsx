import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HeritageSection from "../components/HeritageSection";
import GatesSection from "../components/GatesSection";
import CircuitsSection from "../components/CircuitsSection";
import ShopSection from "../components/ShopSection";
import CityLifeSection from "../components/CityLifeSection";
import Footer from "../components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HeritageSection />
      <GatesSection />
      <CircuitsSection />
      <ShopSection />
      <CityLifeSection />
      <Footer />
    </div>
  );
};

export default Index;
