import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMonumentBySlug } from "@/data/monumentsDetailed";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { OptimizedImage } from "@/components/OptimizedImage";

type ApiReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
};

const MonumentDetailPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const monument = getMonumentBySlug(slug);
  const { t, language } = useAppSettings();
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadReviews = async () => {
    if (!slug) return;
    try {
      const result = await api.get<{ reviews: ApiReview[] }>(`/api/monuments/${slug}/reviews`);
      setReviews(result.reviews || []);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, [slug]);

  const averageRating =
    reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const myReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((review) => review.user?._id === user.id) || null;
  }, [reviews, user]);

  if (!monument) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
            <h1 className="font-heading text-3xl font-bold mb-4">{t("Monument introuvable", "Monument introuvable")}</h1>
            <Link to="/" className="text-primary underline">
              {t("Retour accueil", "Retour accueil")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setMessage(t("Connectez-vous pour publier un avis.", "??? ?????? ???? ?????."));
      return;
    }

    try {
      await api.post(`/api/monuments/${slug}/reviews`, { rating, comment: comment.trim() }, token);
      setComment("");
      setRating(5);
      setEditingReviewId(null);
      setMessage(t("Avis enregistre.", "?? ??? ???????."));
      await loadReviews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("Erreur API", "Erreur API"));
    }
  };

  const startEdit = (review: ApiReview) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  const saveEdit = async () => {
    if (!editingReviewId || !token) return;
    try {
      await api.patch(`/api/monuments/${slug}/reviews/${editingReviewId}`, { rating, comment: comment.trim() }, token);
      setEditingReviewId(null);
      setRating(5);
      setComment("");
      setMessage(t("Modification enregistree.", "?? ??? ???????."));
      await loadReviews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("Erreur API", "Erreur API"));
    }
  };

  const title = language === "ar" ? monument.name.ar : monument.name.fr;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <article className="max-w-5xl mx-auto space-y-8">
          <header className="rounded-2xl border border-border overflow-hidden bg-card">
            <OptimizedImage src={monument.cover} alt={title} className="h-72 w-full" eager sizes="(max-width: 768px) 100vw, 1200px" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-moroccan-ochre-dark font-semibold mb-2">{t("Patrimoine detaille", "Patrimoine detaille")}</p>
              <h1 className="font-heading text-4xl font-bold mb-2">{title}</h1>
              <p className="text-sm text-muted-foreground">{t(`Note moyenne: ${averageRating.toFixed(1)} / 5 (${reviews.length} avis)`, `??????: ${averageRating.toFixed(1)} / 5 (${reviews.length} ?????)`)}</p>
            </div>
          </header>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-2xl font-bold mb-3">{t("Histoire", "Histoire")}</h2>
              <p className="text-muted-foreground">{language === "ar" ? monument.history.ar : monument.history.fr}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-2xl font-bold mb-3">{t("Anecdote", "Anecdote")}</h2>
              <p className="text-muted-foreground">{language === "ar" ? monument.anecdote.ar : monument.anecdote.fr}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-2xl font-bold mb-3">{t("Meilleur moment pour visiter", "Meilleur moment pour visiter")}</h2>
              <p className="text-muted-foreground">{language === "ar" ? monument.bestMoment.ar : monument.bestMoment.fr}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-2xl font-bold mb-3">{t("Duree recommandee", "Duree recommandee")}</h2>
              <p className="text-muted-foreground">{language === "ar" ? monument.recommendedDuration.ar : monument.recommendedDuration.fr}</p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-2xl font-bold mb-3">{t("Conseil local", "Conseil local")}</h2>
            <p className="text-muted-foreground mb-4">{language === "ar" ? monument.localAdvice.ar : monument.localAdvice.fr}</p>
            <h3 className="font-heading text-xl font-semibold mb-3">{t("Photos", "Photos")}</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {monument.photos.map((photo, index) => (
                <OptimizedImage key={`${monument.slug}-photo-${index}`} src={photo} alt={`${title}-${index + 1}`} className="h-40 w-full rounded-lg border border-border" sizes="(max-width: 768px) 100vw, 33vw" />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-2xl font-bold mb-3">{t("Score d'experience apres visite", "Score d'experience apres visite")}</h2>
            <form className="space-y-4" onSubmit={handleReviewSubmit}>
              <div>
                <p className="font-semibold mb-2">{t("Votre note (etoiles)", "Votre note (etoiles)")}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={`star-${star}`} type="button" onClick={() => setRating(star)} className="rounded-md p-1 hover:bg-muted" aria-label={`${star} stars`}>
                      <Star className={star <= rating ? "fill-moroccan-gold text-moroccan-gold" : "text-muted-foreground"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="font-semibold block mb-2">{t("Commentaire (optionnel)", "????? (???????)")}</label>
                <textarea id="comment" value={comment} onChange={(event) => setComment(event.target.value)} className="w-full min-h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder={t("Partagez votre avis...", "???? ????...")} />
              </div>

              <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                {editingReviewId ? t("Ajouter un nouvel avis", "Ajouter un nouvel avis") : t("Publier l'avis", "Publier l'avis")}
              </button>
              {editingReviewId ? (
                <button type="button" onClick={saveEdit} className="ml-3 rounded-lg border border-border px-5 py-2.5 font-semibold">
                  {t("Enregistrer modification", "Enregistrer modification")}
                </button>
              ) : null}
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-2xl font-bold mb-3">{t("Mode communautaire", "Mode communautaire")}</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">{t("Aucun avis pour le moment.", "?? ???? ??????? ?????.")}</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{(review.user?.firstName || t("Visiteur", "Visiteur"))} {review.user?.lastName || ""} - {review.rating}/5</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    {review.comment ? <p className="text-sm text-muted-foreground">{review.comment}</p> : <p className="text-sm text-muted-foreground">{t("Sans commentaire.", "???? ?????.")}</p>}
                    {myReview?._id === review._id ? (
                      <button type="button" onClick={() => startEdit(review)} className="mt-2 rounded-md border border-border px-3 py-1 text-xs">
                        {t("Modifier mon avis", "Modifier mon avis")}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default MonumentDetailPage;
