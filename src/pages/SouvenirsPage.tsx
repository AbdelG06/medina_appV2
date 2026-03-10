import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { OptimizedImage } from "@/components/OptimizedImage";

// Import des images aléatoires
import attarin from "@/assets/attarin.jpg";
import authenMorocco from "@/assets/bab-elhadid.jpg";
import medina from "@/assets/tannerie.jpg";

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
  views?: number;
  likes: string[];
  comments: PhotoComment[];
  user?: { firstName?: string; lastName?: string };
  createdAt?: string;
};

type ProfilePayload = {
  profile: {
    firstName: string;
    lastName: string;
    email?: string;
    role: string;
    bio?: string;
    avatarUrl?: string;
    createdAt?: string;
  };
  stats: {
    postCount: number;
    approvedCount: number;
    totalLikes: number;
  };
  photos: SouvenirPhoto[];
};

// Photos aléatoires par défaut
const defaultPhotos: SouvenirPhoto[] = [
  {
    _id: "random-1",
    caption: "Coucher de soleil magique à Bab Boujloud",
    imageUrl: attarin,
    isApproved: true,
    views: 245,
    likes: ["user1", "user2", "user3"],
    comments: [
      { _id: "c1", text: "Superbe photo !", user: { firstName: "Ahmed", lastName: "Hassan" } },
      { _id: "c2", text: "La médina a son charme 🌅", user: { firstName: "Fatima", lastName: "Louali" } }
    ],
    user: { firstName: "Ali", lastName: "Karim" },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "random-2",
    caption: "Architecture traditionnelle de la médina",
    imageUrl: authenMorocco,
    isApproved: true,
    views: 312,
    likes: ["user1", "user4", "user5", "user6"],
    comments: [
      { _id: "c3", text: "Magnifique ! 👏", user: { firstName: "Mariam", lastName: "El Fassi" } }
    ],
    user: { firstName: "Hassan", lastName: "Bennani" },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "random-3",
    caption: "Les tanneries traditionnelles de Fes",
    imageUrl: medina,
    isApproved: true,
    views: 428,
    likes: ["user2", "user3", "user4", "user7", "user8"],
    comments: [
      { _id: "c4", text: "Incroyable ! Photo de l'année 📸", user: { firstName: "Youssef", lastName: "Qurashi" } },
      { _id: "c5", text: "L'artisanat traditionnel au meilleur", user: { firstName: "Layla", lastName: "Seddik" } },
      { _id: "c6", text: "Bravo pour cette perspective unique !", user: { firstName: "Mohammed", lastName: "Seddiki" } }
    ],
    user: { firstName: "Zahra", lastName: "Bennani" },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SouvenirsPage = () => {
  const { token, user, login, registerUser } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = useState<"feed" | "profile">("feed");
  const [photos, setPhotos] = useState<SouvenirPhoto[]>([]);
  const [myPhotos, setMyPhotos] = useState<SouvenirPhoto[]>([]);
  const [commentByPhoto, setCommentByPhoto] = useState<Record<string, string>>({});

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [profileStats, setProfileStats] = useState({ postCount: 0, approvedCount: 0, totalLikes: 0 });

  const isAuthenticated = Boolean(token && user);
  const feedPhotos = useMemo(() => photos, [photos]);

  const loadPhotos = async () => {
    try {
      const result = await api.get<{ photos: SouvenirPhoto[] }>("/api/souvenirs");
      // Fusionner les photos du serveur avec les 3 photos aléatoires par défaut
      const allPhotos = [...defaultPhotos, ...(result.photos || [])];
      setPhotos(allPhotos);
    } catch {
      // En cas d'erreur, afficher uniquement les 3 photos par défaut
      setPhotos(defaultPhotos);
    }
  };

  const loadProfile = async () => {
    if (!token) return;
    try {
      const result = await api.get<ProfilePayload>("/api/souvenirs/profile/me", token);
      setProfileFirstName(result.profile.firstName || "");
      setProfileLastName(result.profile.lastName || "");
      setProfileBio(result.profile.bio || "");
      setProfileAvatarUrl(result.profile.avatarUrl || "");
      setProfileStats(result.stats || { postCount: 0, approvedCount: 0, totalLikes: 0 });
      setMyPhotos(result.photos || []);
    } catch {
      setMyPhotos([]);
    }
  };

  useEffect(() => {
    void loadPhotos();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setMyPhotos([]);
      return;
    }
    void loadProfile();
  }, [isAuthenticated, token]);

  const uploadLocalImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!token) {
      setMessage("Connectez-vous pour uploader et publier votre photo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setMessage("");
    try {
      const result = await api.post<{ imageUrl: string }>("/api/souvenirs/upload", formData, token);
      setImageUrl(result.imageUrl);
      setMessage("Image uploadee avec succes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload impossible.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitPhoto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setMessage("Connectez-vous pour publier.");
      return;
    }
    if (!imageUrl.trim()) {
      setMessage("Ajoutez une image avant de publier.");
      return;
    }

    try {
      await api.post("/api/souvenirs", { caption: caption.trim(), imageUrl }, token);
      setCaption("");
      setImageUrl("");
      setMessage("Publication envoyee. Elle sera visible apres validation.");
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur API.");
    }
  };

  const likePhoto = async (id: string) => {
    if (!token) {
      setMessage("Connectez-vous pour liker.");
      return;
    }
    try {
      await api.post(`/api/souvenirs/${id}/like`, {}, token);
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action impossible.");
    }
  };

  const addComment = async (id: string) => {
    const text = (commentByPhoto[id] || "").trim();
    if (!text) return;
    if (!token) {
      setMessage("Connectez-vous pour commenter.");
      return;
    }

    try {
      await api.post(`/api/souvenirs/${id}/comments`, { text }, token);
      setCommentByPhoto((prev) => ({ ...prev, [id]: "" }));
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Commentaire impossible.");
    }
  };

  const deletePhoto = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/api/souvenirs/${id}`, token);
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Suppression impossible.");
    }
  };

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(loginId, loginPassword);
      setMessage("Connexion reussie.");
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Connexion impossible.");
    }
  };

  const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await registerUser({
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail,
        password: registerPassword,
      });
      setMessage("Compte cree et connecte.");
      await Promise.all([loadPhotos(), loadProfile()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inscription impossible.");
    }
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    try {
      await api.patch(
        "/api/souvenirs/profile/me",
        {
          firstName: profileFirstName,
          lastName: profileLastName,
          bio: profileBio,
          avatarUrl: profileAvatarUrl,
        },
        token,
      );
      setMessage("Profil mis a jour.");
      await loadProfile();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Mise a jour impossible.");
    }
  };

  const renderAuthCard = () => (
    <div className="rounded-2xl border border-border bg-background p-5">
      {authMode === "login" ? (
        <form onSubmit={onLogin} className="space-y-3">
          <h3 className="font-heading text-xl font-bold">Connexion</h3>
          <input
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            placeholder="Email / CIN / code artisan"
            className="w-full rounded-lg border border-input bg-card px-3 py-2"
            required
          />
          <input
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-input bg-card px-3 py-2"
            required
          />
          <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Se connecter</button>
          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm"
          >
            Creer un compte
          </button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="space-y-3">
          <h3 className="font-heading text-xl font-bold">Creer un compte</h3>
          <input value={registerFirstName} onChange={(event) => setRegisterFirstName(event.target.value)} placeholder="Prenom" className="w-full rounded-lg border border-input bg-card px-3 py-2" required />
          <input value={registerLastName} onChange={(event) => setRegisterLastName(event.target.value)} placeholder="Nom" className="w-full rounded-lg border border-input bg-card px-3 py-2" required />
          <input type="email" value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} placeholder="Email" className="w-full rounded-lg border border-input bg-card px-3 py-2" required />
          <input type="password" value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} placeholder="Mot de passe" className="w-full rounded-lg border border-input bg-card px-3 py-2" required />
          <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">S'inscrire</button>
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm"
          >
            Retour connexion
          </button>
        </form>
      )}
    </div>
  );

  const renderPostCard = (photo: SouvenirPhoto, allowDelete = false) => (
    <article key={photo._id} className="overflow-hidden rounded-lg border border-border bg-background shadow-sm flex flex-col">
      <OptimizedImage src={photo.imageUrl} alt={photo.caption || "Souvenir"} className="aspect-square w-full object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="space-y-2 p-2 flex-1 flex flex-col">
        <div>
          <p className="font-semibold text-foreground text-xs line-clamp-2">{photo.caption || "Sans legende"}</p>
          <p className="text-xs text-muted-foreground">
            {(photo.user?.firstName || "Visiteur")}
          </p>
        </div>

        <div className="flex items-center gap-0.5 text-xs">
          <button type="button" onClick={() => void likePhoto(photo._id)} className="rounded border border-border px-1.5 py-0.5 text-xs">
            Like ({photo.likes?.length || 0})
          </button>
          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            Vues ({Number(photo.views || 0)})
          </span>
          {allowDelete || isAdmin ? (
            <button type="button" onClick={() => void deletePhoto(photo._id)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700">
              Supprimer
            </button>
          ) : null}
        </div>

        <div className="space-y-1 mt-auto text-xs hidden">
          {(photo.comments || []).slice(0, 1).map((comment) => (
            <p key={comment._id} className="rounded-md bg-muted px-2 py-1 text-muted-foreground line-clamp-1">
              <span className="font-semibold">{(comment.user?.firstName || "Visiteur")}:</span> {comment.text}
            </p>
          ))}
          {(photo.comments || []).length > 1 && (
            <p className="text-muted-foreground px-2">+{(photo.comments || []).length - 1} commentaires</p>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-28">
        <section className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-moroccan-ochre-dark">Photos souvenirs</p>
          <h1 className="mb-2 font-heading text-4xl font-bold">Galerie communautaire</h1>
          <p className="mb-6 text-muted-foreground">Publiez, likez, commentez et gerez votre profil comme un mini reseau social.</p>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setTab("feed")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "feed" ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              Fil d'actualite
            </button>
            <button type="button" onClick={() => setTab("profile")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "profile" ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              Mon profil
            </button>
          </div>

          {tab === "feed" ? (
            <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
              {isAuthenticated && (
                <aside className="space-y-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
                        <OptimizedImage src={profileAvatarUrl || user?.avatarUrl || ""} alt="avatar" className="h-full w-full" sizes="48px" />
                      </div>
                      <div>
                        <p className="font-semibold">{profileFirstName || user?.firstName} {profileLastName || user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-lg bg-muted p-2"><p className="font-bold">{profileStats.postCount}</p><p>Posts</p></div>
                      <div className="rounded-lg bg-muted p-2"><p className="font-bold">{profileStats.approvedCount}</p><p>Visibles</p></div>
                      <div className="rounded-lg bg-muted p-2"><p className="font-bold">{profileStats.totalLikes}</p><p>Likes</p></div>
                    </div>
                  </div>

                  <form onSubmit={submitPhoto} className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="mb-3 font-heading text-lg font-bold">Nouvelle publication</h3>
                    <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Ecrivez une legende..." className="mb-3 min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2" />
                    <div className="mb-3 flex flex-col gap-2">
                      <input type="file" accept="image/*" onChange={(event) => void uploadLocalImage(event)} className="w-full text-sm" />
                      {isUploading ? <p className="text-xs text-muted-foreground">Upload en cours...</p> : null}
                    </div>
                    <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Ou coller une URL image" className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" />
                    <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Publier</button>
                  </form>
                </aside>
              )}

              <section className="grid gap-6 grid-cols-3 md:grid-cols-3 w-full">
                {feedPhotos.map((photo) => renderPostCard(photo))}
              </section>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
              {isAuthenticated ? (
                <>
                  <form onSubmit={saveProfile} className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="mb-3 font-heading text-lg font-bold">Modifier mon profil</h3>
                    <input value={profileFirstName} onChange={(event) => setProfileFirstName(event.target.value)} placeholder="Prenom" className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" required />
                    <input value={profileLastName} onChange={(event) => setProfileLastName(event.target.value)} placeholder="Nom" className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" required />
                    <input value={profileAvatarUrl} onChange={(event) => setProfileAvatarUrl(event.target.value)} placeholder="URL photo profil" className="mb-3 w-full rounded-lg border border-input bg-card px-3 py-2" />
                    <textarea value={profileBio} onChange={(event) => setProfileBio(event.target.value)} placeholder="Bio" className="mb-3 min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2" />
                    <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Enregistrer</button>
                  </form>

                  <div className="grid gap-4 md:grid-cols-2">
                    {myPhotos.map((photo) => renderPostCard(photo, true))}
                  </div>
                </>
              ) : (
                <div className="lg:col-span-2">{renderAuthCard()}</div>
              )}
            </div>
          )}

          {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SouvenirsPage;
