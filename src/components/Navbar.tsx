import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Accueil", to: "/" },
  { label: "Patrimoine", to: "#patrimoine" },
  { label: "Les Portes", to: "#portes" },
  { label: "Circuits", to: "#circuits" },
  { label: "Boutique", to: "#boutique" },
  { label: "À propos", to: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section if on home, else navigate home then scroll.
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="font-heading text-2xl font-bold text-primary tracking-wide" style={{ textDecoration: "none" }}>
          <span className="flex flex-col leading-tight">
            <span className="inline-flex items-center gap-2 text-moroccan-ochre-dark">
              <span className="text-base">✦</span>
              <span className="text-2xl font-bold">Médina de Fès</span>
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Fès el-Bali</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.to.startsWith("/") ? (
                <Link
                  to={item.to}
                  className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSectionNav(item.to)}
                  className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors bg-transparent border-none outline-none"
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <ul className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.to.startsWith("/") ? (
                  <Link
                    to={item.to}
                    className="font-body text-base text-foreground/80 hover:text-primary"
                    onClick={() => setOpen(false)}
                    style={{ cursor: "pointer", textDecoration: "none" }}
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
                    className="font-body text-base text-foreground/80 hover:text-primary bg-transparent border-none outline-none"
                    style={{ cursor: "pointer" }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
