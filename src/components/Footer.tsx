import { Link, useLocation, useNavigate } from "react-router-dom";
import ministereLogo from "@/assets/ministere.jpg";
import ramadanIaLogo from "@/assets/ramadan_ia.jpg";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleSectionNav = (hash: string) => {
    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate("/", { replace: false });
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-heading text-2xl font-bold">{t("footer.title")}</h3>
            <p className="font-body text-sm leading-relaxed text-primary-foreground/70">{t("footer.description")}</p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-lg font-semibold">{t("footer.navigation")}</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>
                <button type="button" onClick={() => handleSectionNav("#accueil")} className="transition-colors hover:text-primary-foreground">
                  {t("nav.home")}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionNav("#patrimoine")} className="transition-colors hover:text-primary-foreground">
                  {t("nav.heritage")}
                </button>
              </li>
              <li>
                <Link to="/outils" className="no-underline transition-colors hover:text-primary-foreground">
                  {t("nav.tools")}
                </Link>
              </li>
              <li>
                <Link to="/souvenirs" className="no-underline transition-colors hover:text-primary-foreground">
                  {t("nav.souvenirs")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-lg font-semibold">{t("footer.contact")}</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>{t("footer.location")}</li>
              <li>contact@medina-fes.ma</li>
              <li>+212 5 35 XX XX XX</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://www.mmsp.gov.ma/fr" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20">
              <img src={ministereLogo} alt="Ministere" className="h-14 w-auto object-contain" loading="lazy" />
            </a>
            <div className="rounded-lg bg-white/10 p-2">
              <img src={ramadanIaLogo} alt="Ramadan IA" className="h-14 w-auto object-contain" loading="lazy" />
            </div>
          </div>
          <p className="mt-6 text-center font-body text-xs text-primary-foreground/50">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
