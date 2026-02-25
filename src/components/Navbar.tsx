import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, theme, toggleTheme } = useAppSettings();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.heritage"), to: "#patrimoine" },
    { label: t("nav.shop"), to: "/boutique" },
    { label: t("nav.souvenirs"), to: "/souvenirs" },
    { label: t("nav.tools"), to: "/outils" },
    { label: t("nav.about"), to: "/about" },
  ];

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 gap-4">
        <Link to="/" className="font-heading text-xl font-bold text-primary tracking-wide no-underline">
          <span className="text-moroccan-ochre-dark">{t("brand")}</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.to.startsWith("/") ? (
                <Link to={item.to} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors no-underline">
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSectionNav(item.to)}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors bg-transparent border-none"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/portail"
            className="rounded-md px-3 py-1.5 text-xs font-semibold border border-primary bg-primary text-primary-foreground no-underline hover:bg-primary/90 transition-colors"
          >
            {isAuthenticated ? t("nav.portal") : t("nav.login")}
          </Link>
          <button
            type="button"
            className={`rounded-md px-2.5 py-1.5 text-xs border ${language === "fr" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
            onClick={() => setLanguage("fr")}
            aria-label={t("common.switchToFr")}
          >
            FR
          </button>
          <button
            type="button"
            className={`rounded-md px-2.5 py-1.5 text-xs border ${language === "ar" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
            onClick={() => setLanguage("ar")}
            aria-label={t("common.switchToAr")}
          >
            AR
          </button>
          <div className="flex items-center gap-2">
            <Sun size={15} className="text-muted-foreground" />
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label={t("common.darkMode")} />
            <Moon size={15} className="text-muted-foreground" />
          </div>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)} aria-label={t("nav.menu")}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <ul className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.to.startsWith("/") ? (
                  <Link
                    to={item.to}
                    className="text-base text-foreground/80 hover:text-primary no-underline"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleSectionNav(item.to);
                    }}
                    className="text-base text-foreground/80 hover:text-primary bg-transparent border-none"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`rounded-md px-2.5 py-1.5 text-xs border ${language === "fr" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                onClick={() => setLanguage("fr")}
                aria-label={t("common.switchToFr")}
              >
                FR
              </button>
              <button
                type="button"
                className={`rounded-md px-2.5 py-1.5 text-xs border ${language === "ar" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                onClick={() => setLanguage("ar")}
                aria-label={t("common.switchToAr")}
              >
                AR
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={14} className="text-muted-foreground" />
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label={t("common.darkMode")} />
              <Moon size={14} className="text-muted-foreground" />
            </div>
            <Link
              to="/portail"
              className="rounded-md px-3 py-1.5 text-xs font-semibold border border-primary bg-primary text-primary-foreground no-underline"
              onClick={() => setOpen(false)}
            >
              {isAuthenticated ? t("nav.portal") : t("nav.login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
