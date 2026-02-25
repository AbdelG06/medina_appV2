import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { culturalTerms, productPriceRanges } from "@/data/culturalData";

type MonitoringRequest = {
  id: string;
  productName: string;
  proposedPrice: number;
  note: string;
  status: "pending" | "accepted" | "rejected";
};

const ToolsPage = () => {
  const { t, language } = useAppSettings();

  const [selectedProductId, setSelectedProductId] = useState(productPriceRanges[0].id);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [monitoringRequests, setMonitoringRequests] = useState<MonitoringRequest[]>([]);
  const [monitorProduct, setMonitorProduct] = useState("");
  const [monitorPrice, setMonitorPrice] = useState<number>(0);
  const [monitorNote, setMonitorNote] = useState("");

  const selectedProduct = useMemo(
    () => productPriceRanges.find((product) => product.id === selectedProductId) ?? productPriceRanges[0],
    [selectedProductId],
  );

  const priceStatus =
    currentPrice < selectedProduct.minDh || currentPrice > selectedProduct.maxDh
      ? t("Prix abuse", "سعر مبالغ فيه")
      : t("Bon prix", "سعر مناسب");

  const priceStatusColor =
    currentPrice < selectedProduct.minDh || currentPrice > selectedProduct.maxDh
      ? "text-red-600 bg-red-50 border-red-200"
      : "text-green-700 bg-green-50 border-green-200";

  const submitMonitoringRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!monitorProduct.trim()) return;

    const newRequest: MonitoringRequest = {
      id: crypto.randomUUID(),
      productName: monitorProduct.trim(),
      proposedPrice: monitorPrice,
      note: monitorNote.trim(),
      status: "pending",
    };

    setMonitoringRequests((prev) => [newRequest, ...prev]);
    setMonitorProduct("");
    setMonitorPrice(0);
    setMonitorNote("");
  };

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setMonitoringRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 space-y-8">
        <section className="max-w-5xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">
            {t("Comparateur de prix artisanaux", "مقارن أسعار الصناعة التقليدية")}
          </p>
          <h1 className="font-heading text-4xl font-bold mb-4">
            {t("Verifier un prix en dirhams", "تحقق من السعر بالدرهم")}
          </h1>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block font-semibold">{t("Produit", "المنتج")}</label>
              <select
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              >
                {productPriceRanges.map((product) => (
                  <option key={product.id} value={product.id}>
                    {language === "ar" ? product.product.ar : product.product.fr}
                  </option>
                ))}
              </select>
              <label className="block font-semibold">{t("Prix propose (DH)", "السعر المقترح (درهم)")}</label>
              <input
                type="number"
                value={currentPrice}
                onChange={(event) => setCurrentPrice(Number(event.target.value))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-semibold mb-1">{t("Fourchette conseilee", "النطاق المقترح")}</p>
              <p className="text-muted-foreground mb-3">
                {selectedProduct.minDh} - {selectedProduct.maxDh} DH
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "ar" ? selectedProduct.notes.ar : selectedProduct.notes.fr}
              </p>
              <div className={`inline-block rounded-lg border px-3 py-2 font-semibold ${priceStatusColor}`}>
                {priceStatus}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">
            {t("Mini dictionnaire culturel", "قاموس ثقافي مصغر")}
          </p>
          <h2 className="font-heading text-3xl font-bold mb-5">{t("Termes essentiels", "مصطلحات أساسية")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {culturalTerms.map((term) => (
              <div key={term.term} className="rounded-xl border border-border bg-background p-4">
                <h3 className="font-heading text-2xl font-semibold mb-2">{term.term}</h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? term.definition.ar : term.definition.fr}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">
            {t("Investir / Collaborer", "استثمار / تعاون")}
          </p>
          <h2 className="font-heading text-3xl font-bold mb-3">
            {t("Collaboration avec artisans et commercants", "التعاون مع الحرفيين والتجار")}
          </h2>
          <p className="text-muted-foreground mb-5">
            {t(
              "Les artisans peuvent gerer leur stock, ajouter des produits et envoyer une proposition de prix. L'equipe centrale et l'artisan valident ensuite la decision.",
              "يمكن للحرفيين إدارة المخزون وإضافة المنتجات وإرسال اقتراحات الأسعار. ثم يراجع الفريق المركزي والحرفي القرار.",
            )}
          </p>

          <form onSubmit={submitMonitoringRequest} className="grid md:grid-cols-3 gap-3 mb-5">
            <input
              value={monitorProduct}
              onChange={(event) => setMonitorProduct(event.target.value)}
              placeholder={t("Nom du produit", "اسم المنتج")}
              className="rounded-lg border border-input bg-background px-3 py-2"
            />
            <input
              type="number"
              value={monitorPrice}
              onChange={(event) => setMonitorPrice(Number(event.target.value))}
              placeholder={t("Prix propose (DH)", "السعر المقترح (درهم)")}
              className="rounded-lg border border-input bg-background px-3 py-2"
            />
            <input
              value={monitorNote}
              onChange={(event) => setMonitorNote(event.target.value)}
              placeholder={t("Note pour l'equipe", "ملاحظة للفريق")}
              className="rounded-lg border border-input bg-background px-3 py-2"
            />
            <button
              type="submit"
              className="md:col-span-3 rounded-lg bg-primary px-4 py-2.5 text-primary-foreground font-semibold"
            >
              {t("Envoyer en surveillance de prix", "إرسال للمراقبة السعرية")}
            </button>
          </form>

          <div className="space-y-3">
            {monitoringRequests.length === 0 ? (
              <p className="text-muted-foreground">{t("Aucune demande pour le moment.", "لا توجد طلبات حاليا.")}</p>
            ) : (
              monitoringRequests.map((request) => (
                <div key={request.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      {request.productName} - {request.proposedPrice} DH
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.status === "pending"
                        ? t("En attente", "قيد المراجعة")
                        : request.status === "accepted"
                        ? t("Accepte", "مقبول")
                        : t("Refuse", "مرفوض")}
                    </p>
                  </div>
                  {request.note ? <p className="text-sm text-muted-foreground mt-2">{request.note}</p> : null}
                  {request.status === "pending" ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "accepted")}
                        className="rounded-md bg-secondary px-3 py-1.5 text-secondary-foreground text-sm"
                      >
                        {t("Accepter", "قبول")}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "rejected")}
                        className="rounded-md border border-border px-3 py-1.5 text-sm"
                      >
                        {t("Refuser", "رفض")}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;
