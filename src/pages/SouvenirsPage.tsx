import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/OptimizedImage";

type PhotoComment = {
  _id: string;
  text: string;
  user?: { firstName?: string; lastName?: string };
};

type SouvenirPhoto = {
  _id: string;
  caption: string;
  imageUrl: string;
  isApproved: boolean;
  likes: string[];
  comments: PhotoComment[];
  user?: { firstName?: string; lastName?: string };
};

const SouvenirsPage = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();

  const [photos, setPhotos] = useState<SouvenirPhoto[]>([]);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [commentByPhoto, setCommentByPhoto] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = user?.role === "admin";

  const loadPhotos = async () => {
    try {
      const result = await api.get<{ photos: SouvenirPhoto[] }>("/api/souvenirs");
      setPhotos(result.photos || []);
    } catch {
      setPhotos([]);
    }
  };

  useEffect(() => {
    void loadPhotos();
  }, []);

  const uploadLocalImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setMessage("");
    try {
      const result = await api.post<{ imageUrl: string }>("/api/souvenirs/upload", formData, token);
      setImageUrl(result.imageUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload impossible.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitPhoto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setMessage(t("souvenirs.loginToPublish"));
      return;
    }
    if (!imageUrl.trim()) return;
    try {
      await api.post("/api/souvenirs", { caption: caption.trim(), imageUrl }, token);
      setCaption("");
      setImageUrl("");
      setMessage(t("souvenirs.uploadedForModeration"));
      await loadPhotos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur API");
    }
  };

  const likePhoto = async (id: string) => {
    if (!token) {
      setMessage(t("souvenirs.loginToLike"));
      return;
    }
    await api.post(`/api/souvenirs/${id}/like`, {}, token);
    await loadPhotos();
  };

  const addComment = async (id: string) => {
    const text = (commentByPhoto[id] || "").trim();
    if (!text || !token) return;
    await api.post(`/api/souvenirs/${id}/comments`, { text }, token);
    setCommentByPhoto((prev) => ({ ...prev, [id]: "" }));
    await loadPhotos();
  };

  const deletePhoto = async (id: string) => {
    if (!token || !isAdmin) return;
    await api.delete(`/api/souvenirs/${id}`, token);
    await loadPhotos();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-28">
        <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-moroccan-ochre-dark">{t("souvenirs.badge")}</p>
          <h1 className="mb-3 font-heading text-4xl font-bold">{t("souvenirs.title")}</h1>
          <p className="mb-5 text-muted-foreground">{t("souvenirs.subtitle")}</p>

          <form onSubmit={submitPhoto} className="mb-6 rounded-xl border border-border bg-background p-4">
            <label className="mb-2 block font-semibold">{t("souvenirs.captionLabel")}</label>
            <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder={t("souvenirs.captionPlaceholder")} className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" />
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input type="file" accept="image/*" onChange={(event) => void uploadLocalImage(event)} className="block w-full text-sm" />
              {isUploading ? (
                <span className="inline-flex min-w-[140px] items-center justify-center rounded-lg border border-border px-3 py-2 text-xs">
                  <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("common.uploading")}
                </span>
              ) : null}
            </div>
            <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder={t("souvenirs.orImageUrl")} className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" />
            <button className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground">{t("common.publish")}</button>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {photos.map((photo) => (
              <article key={photo._id} className="overflow-hidden rounded-xl border border-border bg-background">
                <OptimizedImage src={photo.imageUrl} alt={photo.caption} className="h-64 w-full" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="p-4">
                  <p className="mb-1 font-semibold">{photo.caption}</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {(photo.user?.firstName || t("common.visitor"))} {photo.user?.lastName || ""}
                  </p>
                  <div className="mb-3 flex items-center gap-2">
                    <button type="button" onClick={() => likePhoto(photo._id)} className="rounded-md border border-border px-3 py-1.5 text-sm">
                      {t("common.like")} ({photo.likes.length})
                    </button>
                    {isAdmin ? (
                      <button type="button" onClick={() => deletePhoto(photo._id)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700">
                        {t("common.delete")}
                      </button>
                    ) : null}
                  </div>
                  <div className="mb-3 space-y-2">
                    {photo.comments.map((comment) => (
                      <p key={comment._id} className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                        {(comment.user?.firstName || t("common.visitor"))}: {comment.text}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={commentByPhoto[photo._id] || ""} onChange={(event) => setCommentByPhoto((prev) => ({ ...prev, [photo._id]: event.target.value }))} placeholder={t("common.addComment")} className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm" />
                    <button type="button" onClick={() => addComment(photo._id)} className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                      {t("common.publish")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SouvenirsPage;
