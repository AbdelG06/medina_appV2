import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/apiClient";
import { OptimizedImage } from "@/components/OptimizedImage";

type ProductItem = {
  _id: string;
  title?: string;
  name?: string;
  price?: number;
  priceDh?: number;
  imageUrl?: string;
  images?: string[];
  views?: number;
};

type ShopPayload = {
  shop: {
    shopName: string;
    shopDescription?: string;
    shopLogo?: string;
    city?: string;
    artisanName?: string;
  };
  products: ProductItem[];
};

const ArtisanShopPage = () => {
  const { artisanId } = useParams();
  const [payload, setPayload] = useState<ShopPayload | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!artisanId) return;
    const load = async () => {
      try {
        const result = await api.get<ShopPayload>(`/api/products/shop/${artisanId}`);
        setPayload(result);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Chargement impossible.");
      }
    };
    void load();
  }, [artisanId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        {message ? <p className="mb-6 text-sm text-red-600">{message}</p> : null}
        {payload ? (
          <>
            <div className="mb-8 rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-xl">
                  <OptimizedImage src={payload.shop.shopLogo || ""} alt={payload.shop.shopName} className="h-full w-full" sizes="80px" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold">{payload.shop.shopName}</h1>
                  <p className="text-muted-foreground">{payload.shop.city || "Fes"} • {payload.shop.artisanName || "Artisan"}</p>
                  {payload.shop.shopDescription ? <p className="text-sm text-muted-foreground mt-2">{payload.shop.shopDescription}</p> : null}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {payload.products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="no-underline rounded-2xl border border-border bg-card overflow-hidden hover:shadow-moroccan transition-shadow">
                  <div className="h-52 overflow-hidden">
                    <OptimizedImage src={product.images?.[0] || product.imageUrl || ""} alt={product.title || product.name || "Produit"} className="h-full w-full" sizes="(max-width: 1280px) 50vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <h2 className="font-heading text-xl font-semibold text-foreground">{product.title || product.name}</h2>
                    <p className="text-primary font-semibold">{Number(product.price ?? product.priceDh ?? 0)} DH</p>
                    <p className="text-xs text-muted-foreground mt-1">{product.views || 0} vues</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default ArtisanShopPage;
