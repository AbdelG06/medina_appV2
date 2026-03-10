import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/apiClient";
import { OptimizedImage } from "@/components/OptimizedImage";

type ProductPayload = {
  product: {
    _id: string;
    title?: string;
    name?: string;
    price?: number;
    priceDh?: number;
    description?: string;
    images?: string[];
    imageUrl?: string;
    views?: number;
    artisanId?: string;
  };
  artisan?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    shopName?: string;
  } | null;
};

const ProductPublicPage = () => {
  const { id } = useParams();
  const [payload, setPayload] = useState<ProductPayload | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const result = await api.get<ProductPayload>(`/api/products/${id}`);
        setPayload(result);
        setActiveImage(0);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Chargement impossible.");
      }
    };
    void load();
  }, [id]);

  const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setFeedback("");
    try {
      await api.post(`/api/products/${id}/contact`, contactForm);
      setFeedback("Message envoye a l'artisan.");
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Envoi impossible.");
    }
  };

  const images = payload?.product?.images?.length ? payload.product.images : [payload?.product?.imageUrl || ""];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        {payload ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <div className="mb-3 h-[420px] overflow-hidden rounded-2xl border border-border bg-card">
                <OptimizedImage src={images[activeImage] || ""} alt={payload.product.title || payload.product.name || "Produit"} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((src, index) => (
                  <button key={`${src}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`h-20 overflow-hidden rounded-lg border ${index === activeImage ? "border-primary" : "border-border"}`}>
                    <OptimizedImage src={src} alt={`thumb-${index}`} className="h-full w-full" sizes="120px" />
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">{payload.product.title || payload.product.name}</h1>
              <p className="text-2xl font-bold text-primary">{Number(payload.product.price ?? payload.product.priceDh ?? 0)} DH</p>
              <p className="text-muted-foreground">{payload.product.description || "Aucune description."}</p>
              <p className="text-sm text-muted-foreground">Artisan: {payload.artisan?.shopName || `${payload.artisan?.firstName || ""} ${payload.artisan?.lastName || ""}`.trim() || "Artisan"}</p>
              <p className="text-xs text-muted-foreground">{payload.product.views || 0} vues</p>

              <form onSubmit={onSendMessage} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <h2 className="font-semibold">Contacter l'artisan</h2>
                <input
                  value={contactForm.name}
                  onChange={(e) => setContactForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  required
                />
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="Votre email"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  required
                />
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Votre message"
                  className="w-full min-h-24 rounded-lg border border-input bg-background px-3 py-2"
                  required
                />
                <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold">Contacter artisan</button>
                {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
              </form>
            </section>
          </div>
        ) : (
          <p className="text-muted-foreground">{feedback || "Chargement..."}</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPublicPage;
