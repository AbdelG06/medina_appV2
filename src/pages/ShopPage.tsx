import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { shopItems, type LocalizedText } from "@/data/shopCatalog";

const ShopPage = () => {
  const { language, t } = useAppSettings();
  const getText = (value: LocalizedText) => (language === "ar" ? value.ar : value.fr);

  const categories = Array.from(new Set(shopItems.map((item) => getText(item.category))));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8 rounded-3xl border border-border bg-gradient-to-r from-card to-muted/40 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-moroccan-ochre-dark font-semibold mb-2">{t("E-shop", "متجر إلكتروني")}</p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{t("Boutique de la Medina", "متجر المدينة")}</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            {t(
              "Produits artisanaux verifies avec prix clairs, artisans identifies et contact direct.",
              "منتجات حرفية موثوقة مع أسعار واضحة وحرفيين معروفين وتواصل مباشر.",
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {categories.map((category) => {
            const items = shopItems.filter((item) => getText(item.category) === category);
            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-foreground">{category}</h2>
                  <span className="text-xs text-muted-foreground">{items.length} {t("articles", "منتجات")}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-moroccan transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={item.image}
                          alt={getText(item.name)}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-heading text-xl font-bold text-foreground">{getText(item.name)}</h3>
                          <span className="rounded-md bg-primary/10 text-primary px-2.5 py-1 text-sm font-bold whitespace-nowrap">{item.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-6">{getText(item.description)}</p>
                        <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                          <p><span className="font-semibold">{t("Artisan", "الحرفي")}: </span>{getText(item.artisanName)}</p>
                          <p className="text-muted-foreground"><span className="font-semibold text-foreground">{t("Adresse", "العنوان")}: </span>{getText(item.artisanAddress)}</p>
                        </div>
                        {item.phone ? (
                          <a
                            href={`tel:${item.phone.replace(/\s+/g, "")}`}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground no-underline hover:bg-primary/90 transition-colors"
                          >
                            {t("Appeler", "اتصال")} {item.phone}
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
