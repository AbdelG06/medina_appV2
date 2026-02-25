import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { shopItems, type LocalizedText } from "@/data/shopCatalog";

const ShopSection = () => {
  const { language, t } = useAppSettings();
  const shouldReduceMotion = useReducedMotion();
  const getText = (value: LocalizedText) => (language === "ar" ? value.ar : value.fr);
  const featuredItems = shopItems.slice(0, 3);

  return (
    <section id="boutique" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-moroccan-ochre-dark mb-3">
            {t("Artisanat Authentique", "حرف أصيلة")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("Boutique de la Medina", "متجر المدينة")}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Des prix transparents et equitables pour un artisanat authentique, directement des maitres artisans.",
              "أسعار واضحة وعادلة لمنتجات حرفية أصيلة مباشرة من عند المعلمين الحرفيين.",
            )}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredItems.map((item, i) => (
            <motion.article
              key={item.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.04, duration: 0.35 }}
              className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-moroccan transition-shadow group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={getText(item.name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading text-lg font-semibold text-foreground">{getText(item.name)}</h4>
                  <span className="font-heading text-base font-bold text-primary whitespace-nowrap ml-2">{item.price}</span>
                </div>
                <p className="font-body text-xs text-moroccan-ochre-dark mb-2">
                  {getText(item.artisanName)} - {getText(item.artisanAddress)}
                </p>
                <p className="font-body text-sm text-muted-foreground">{getText(item.description)}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/boutique"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline hover:bg-primary/90 transition-colors"
          >
            {t("Ouvrir e-shop", "فتح المتجر الإلكتروني")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
