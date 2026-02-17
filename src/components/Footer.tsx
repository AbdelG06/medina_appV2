import { useLocation, useNavigate } from "react-router-dom";
import ministereLogo from "../assets/ministere.jpg";
import ramadanLogo from "../assets/ramadan_ia.jpg";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNav = (hash: string) => {
    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">✦ Médina de Fès</h3>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Découvrez la magie de la plus ancienne médina du monde, classée patrimoine mondial de l'UNESCO depuis 1981.
            </p>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed mt-3">
              Médina de Fès : un héritage vivant de traditions, d’artisanat et d’architecture.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>
                <button type="button" onClick={() => handleSectionNav("#accueil")} className="hover:text-primary-foreground transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("#patrimoine")} className="hover:text-primary-foreground transition-colors">
                  Patrimoine
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("#portes")} className="hover:text-primary-foreground transition-colors">
                  Les 12 Portes
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("#circuits")} className="hover:text-primary-foreground transition-colors">
                  Circuits
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("#boutique")} className="hover:text-primary-foreground transition-colors">
                  Boutique
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>📍 Fès el-Bali, Maroc</li>
              <li>📧 contact@medina-fes.ma</li>
              <li>📞 +212 5 35 XX XX XX</li>
            </ul>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://www.mmsp.gov.ma/ar" target="_blank" rel="noopener noreferrer" aria-label="Ministère">
                <img
                  src={ministereLogo}
                  alt="Ministère"
                  className="h-12 w-auto rounded-md bg-white/80 p-2 brightness-110 contrast-110"
                  loading="lazy"
                />
              </a>
              <img
                src={ramadanLogo}
                alt="Ramadan IA"
                className="h-12 w-auto rounded-md bg-white/80 p-2 brightness-110 contrast-110"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © 2026 Médina de Fès — Patrimoine & Culture. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
