import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { api } from "@/lib/apiClient";
import { OptimizedImage } from "@/components/OptimizedImage";
import { shopItems, type LocalizedText } from "@/data/shopCatalog";

type DbShopItem = {
  _id: string;
  type: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  contact?: string;
};

type UiShopItem = {
  id: string;
  name: LocalizedText;
  artisanName: LocalizedText;
  artisanAddress: LocalizedText;
  description: LocalizedText;
  image: string;
  price: string;
};

const ShopSection = () => {
  const { language, t } = useAppSettings();
  const shouldReduceMotion = useReducedMotion();
  const [dbItems, setDbItems] = useState<UiShopItem[]>([]);
  const getText = (value: LocalizedText) => (language === "en" ? value.fr : value.fr);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await api.get<{ items: DbShopItem[] }>("/api/content?type=eshop,product");
        const mapped = (result.items || []).map<UiShopItem>((item) => ({
          id: item._id,
          name: { fr: item.name || "Produit", ar: "" },
          artisanName: { fr: item.contact || "Artisan local", ar: "" },
          artisanAddress: { fr: "Medina de Fes", ar: "" },
          description: { fr: item.description || "", ar: "" },
          image: item.imageUrl || "",
          price: item.price || "Prix sur demande",
        }));
        setDbItems(mapped);
      } catch {
        setDbItems([]);
      }
    };

    void loadItems();
  }, []);

  const featuredItems = useMemo(() => (dbItems.length ? dbItems.slice(0, 3) : shopItems.slice(0, 3)), [dbItems]);

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
            {t("Artisanat Authentique", "Authentic Craftsmanship")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("Boutique de la Medina", "Medina Shop")}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Des prix transparents et equitables pour un artisanat authentique, directement des maitres artisans.",
              "Transparent and fair prices for authentic craftsmanship, directly from master artisans.",
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
                <OptimizedImage
                  src={item.image}
                  alt={getText(item.name)}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 50vw, 33vw"
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
            {t("Ouvrir e-shop", "Open e-shop")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
