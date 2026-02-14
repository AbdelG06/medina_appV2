const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">✦ Médina de Fès</h3>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Découvrez la magie de la plus ancienne médina du monde, classée patrimoine mondial de l'UNESCO depuis 1981.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li><a href="#accueil" className="hover:text-primary-foreground transition-colors">Accueil</a></li>
              <li><a href="#patrimoine" className="hover:text-primary-foreground transition-colors">Patrimoine</a></li>
              <li><a href="#portes" className="hover:text-primary-foreground transition-colors">Les 12 Portes</a></li>
              <li><a href="#circuits" className="hover:text-primary-foreground transition-colors">Circuits</a></li>
              <li><a href="#boutique" className="hover:text-primary-foreground transition-colors">Boutique</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li>📍 Fès el-Bali, Maroc</li>
              <li>📧 contact@medina-fes.ma</li>
              <li>📞 +212 5 35 XX XX XX</li>
            </ul>
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
