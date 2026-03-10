import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/apiClient";
import { OptimizedImage } from "@/components/OptimizedImage";

type ShopCard = {
  artisanId: string;
  shopName: string;
  shopSlug?: string;
  shopDescription?: string;
  shopLogo?: string;
  city?: string;
  productCount: number;
};

const EshopPage = () => {
  const [shops, setShops] = useState<ShopCard[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.get<{ shops: ShopCard[] }>("/api/products/eshop");
        setShops(result.shops || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Chargement impossible.");
      }
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">E-shop artisans</h1>
        <p className="text-muted-foreground mb-8">Choisissez une boutique artisanale puis découvrez ses produits.</p>
        {message ? <p className="mb-6 text-sm text-red-600">{message}</p> : null}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => (
            <Link key={shop.artisanId} to={`/shop/${shop.artisanId}`} className="no-underline rounded-2xl border border-border bg-card p-4 hover:shadow-moroccan transition-shadow">
              <div className="mb-3 h-40 overflow-hidden rounded-xl">
                <OptimizedImage src={shop.shopLogo || ""} alt={shop.shopName} className="h-full w-full" sizes="(max-width: 1280px) 50vw, 33vw" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-foreground">{shop.shopName}</h2>
              <p className="text-sm text-muted-foreground mt-1">{shop.city || "Fes"}</p>
              <p className="text-sm text-primary font-semibold mt-2">{shop.productCount} produits</p>
              {shop.shopDescription ? <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{shop.shopDescription}</p> : null}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EshopPage;
