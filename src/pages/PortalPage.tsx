
import { useEffect, useMemo, useState } from "react";
import {
  faBox,
  faBuilding,
  faComments,
  faGauge,
  faGear,
  faImage,
  faMoon,
  faPlus,
  faStore,
  faSun,
  faCircleCheck,
  faTrashCan,
  faUser,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip, PointElement, LineElement } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/OptimizedImage";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip, PointElement, LineElement);

type Product = {
  _id: string;
  title?: string;
  name: string;
  price?: number;
  priceDh: number;
  description: string;
  imageUrl: string;
  images?: string[];
  stock?: number;
  category?: string;
  views?: number;
  createdAt?: string;
  status: "pending" | "accepted" | "rejected";
};

type Monument = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  city?: string;
  shortDescription?: string;
  history?: string;
  anecdote?: string;
  bestVisitTime?: string;
  recommendedDuration?: string;
  localAdvice?: string;
  photos?: string[];
  views?: number;
  location?: { lat?: number; lng?: number; address?: string };
};

type ContentItem = {
  _id: string;
  type: "eshop" | "restaurant" | "cafe" | "riad" | string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  contact?: string;
  site?: string;
};

type ArtisanRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  shopName?: string;
  status: "pending" | "accepted" | "rejected" | "suspended";
  recommended?: boolean;
  productCount: number;
  createdAt: string;
};

type DashboardPayload = {
  cards: { monumentCount: number; artisanCount: number; productCount: number; productViews?: number; visitorCount: number; unreadMessages: number };
  latestArtisans: Array<{ firstName: string; lastName: string; email?: string; status: string; createdAt: string }>;
  latestProducts: Array<{ name: string; category?: string; status: string; priceDh: number; createdAt: string }>;
  topProducts?: Array<{ name: string; views: number; createdAt?: string }>;
  charts: {
    productsByCategory: Array<{ category: string; total: number }>;
    artisansByMonth: Array<{ month: string; total: number }>;
    monumentViews: Array<{ name: string; views: number }>;
  };
};

type MessageItem = {
  _id: string;
  subject?: string;
  content: string;
  readAt?: string | null;
  createdAt: string;
  fromUser?: { firstName?: string; lastName?: string };
  source?: "internal" | "product" | string;
};

type Souvenir = {
  _id: string;
  caption: string;
  imageUrl: string;
  isApproved: boolean;
  comments: Array<{ _id: string; text: string }>;
};

type UserRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  status?: string;
  createdAt: string;
};

type AdminSection = "dashboard" | "monuments" | "artisans" | "products" | "content" | "gallery" | "reviews" | "users" | "settings";
type ArtisanSection = "dashboard" | "products" | "add" | "gallery" | "messages" | "profile";

const adminMenu: Array<{ id: AdminSection; labelKey: string; icon: typeof faGauge }> = [
  { id: "dashboard", labelKey: "portal.adminDashboard", icon: faGauge },
  { id: "monuments", labelKey: "portal.manageMonuments", icon: faBuilding },
  { id: "artisans", labelKey: "portal.manageArtisans", icon: faUsers },
  { id: "products", labelKey: "portal.artisanProducts", icon: faStore },
  { id: "content", labelKey: "portal.contentMgmt", icon: faStore },
  { id: "gallery", labelKey: "portal.gallery", icon: faImage },
  { id: "reviews", labelKey: "portal.reviews", icon: faComments },
  { id: "users", labelKey: "portal.users", icon: faUser },
  { id: "settings", labelKey: "portal.settings", icon: faGear },
];

const artisanMenu: Array<{ id: ArtisanSection; labelKey: string; icon: typeof faGauge }> = [
  { id: "dashboard", labelKey: "portal.artisanDashboard", icon: faGauge },
  { id: "products", labelKey: "portal.myProducts", icon: faBox },
  { id: "add", labelKey: "portal.addProduct", icon: faPlus },
  { id: "gallery", labelKey: "portal.gallery", icon: faImage },
  { id: "messages", labelKey: "portal.messages", icon: faComments },
  { id: "profile", labelKey: "portal.myProfile", icon: faUser },
];

const cardClass = "rounded-2xl border border-border bg-card p-4 shadow-sm";

const PortalPage = () => {
  const { theme, toggleTheme, isRtl } = useAppSettings();
  const { user, token, login, registerArtisan, registerUser, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cin, setCin] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"artisan" | "user">("artisan");

  const [adminSection, setAdminSection] = useState<AdminSection>("dashboard");
  const [artisanSection, setArtisanSection] = useState<ArtisanSection>("dashboard");

  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [artisans, setArtisans] = useState<ArtisanRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const [productForm, setProductForm] = useState({
    title: "",
    price: 0,
    description: "",
    category: "autre",
    stock: 0,
    imageUrls: [] as string[],
  });
  const [productImageUrlInput, setProductImageUrlInput] = useState("");
  const [uploadingProductImages, setUploadingProductImages] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [monumentForm, setMonumentForm] = useState({
    id: "",
    name: "",
    slug: "",
    category: "General",
    city: "Fes",
    shortDescription: "",
    history: "",
    anecdote: "",
    bestVisitTime: "",
    recommendedDuration: "",
    localAdvice: "",
    photosCsv: "",
    lat: 0,
    lng: 0,
    address: "",
  });
  const [contentForm, setContentForm] = useState({
    id: "",
    type: "eshop",
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    contact: "",
    site: "",
  });

  const isAdmin = user?.role === "admin";
  const isArtisan = user?.role === "artisan";
  const pendingProducts = useMemo(() => products.filter((p) => p.status === "pending"), [products]);
  const artisanStats = useMemo(() => {
    const totalProducts = products.length;
    const totalViews = products.reduce((sum, p) => sum + Number(p.views || 0), 0);
    const topProducts = [...products].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 3);
    const unreadMessages = messages.filter((m) => !m.readAt).length;
    return { totalProducts, totalViews, topProducts, unreadMessages };
  }, [products, messages]);

  const loadAdminData = async () => {
    if (!token || !isAdmin) return;
    try {
      const [dashboardData, monumentsData, artisansData, productsData, usersData, messagesData, souvenirsData, contentData] = await Promise.allSettled([
        api.get<DashboardPayload>("/api/admin/dashboard", token),
        api.get<{ monuments: Monument[] }>("/api/monuments", token),
        api.get<{ artisans: ArtisanRow[] }>("/api/admin/artisans", token),
        api.get<{ products: Product[] }>("/api/products/mine?page=1&limit=100", token),
        api.get<{ users: UserRow[] }>("/api/admin/users", token),
        api.get<{ messages: MessageItem[] }>("/api/messages/inbox", token),
        api.get<{ photos: Souvenir[] }>("/api/souvenirs/admin/all", token),
        api.get<{ items: ContentItem[] }>("/api/admin/content?type=eshop,restaurant,cafe,riad", token),
      ]);

      if (dashboardData.status === "fulfilled") setDashboard(dashboardData.value);
      if (monumentsData.status === "fulfilled") setMonuments(monumentsData.value.monuments || []);
      if (artisansData.status === "fulfilled") setArtisans(artisansData.value.artisans || []);
      if (productsData.status === "fulfilled") setProducts(productsData.value.products || []);
      if (usersData.status === "fulfilled") setUsers(usersData.value.users || []);
      if (messagesData.status === "fulfilled") setMessages(messagesData.value.messages || []);
      if (souvenirsData.status === "fulfilled") setSouvenirs(souvenirsData.value.photos || []);
      if (contentData.status === "fulfilled") setContentItems(contentData.value.items || []);

      const hasFailure = [dashboardData, monumentsData, artisansData, productsData, usersData, messagesData, souvenirsData, contentData].some((r) => r.status === "rejected");
      if (hasFailure) {
        setMessage("Certaines donnees admin n'ont pas pu etre chargees, mais les actions principales restent actives.");
      } else {
        setMessage("");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur reseau/API.");
    }
  };

  const loadArtisanData = async () => {
    if (!token || !isArtisan) return;
    try {
      const [productsData, messagesData, souvenirsData] = await Promise.all([
        api.get<{ products: Product[] }>("/api/products/mine?page=1&limit=100", token),
        api.get<{ messages: MessageItem[] }>("/api/messages/inbox", token),
        api.get<{ photos: Souvenir[] }>("/api/souvenirs/mine", token),
      ]);

      setProducts(productsData.products || []);
      setMessages(messagesData.messages || []);
      setSouvenirs(souvenirsData.photos || []);
      setMessage("");
    } catch (error) {
      setProducts([]);
      setMessages([]);
      setSouvenirs([]);
      setMessage(error instanceof Error ? error.message : "Compte artisan non actif.");
    }
  };

  const runAction = async (action: () => Promise<void>, fallbackMessage = "Erreur reseau/API.") => {
    try {
      setMessage("");
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : fallbackMessage);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isAdmin) void loadAdminData();
    if (isArtisan) void loadArtisanData();
  }, [isAuthenticated, isAdmin, isArtisan, token]);

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await login(loginId, loginPassword);
      setMessage("Connexion reussie.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur API");
    } finally {
      setBusy(false);
    }
  };

    const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (registerRole === "artisan") {
        await registerArtisan({ firstName, lastName, cin, shopAddress, shopName, email: email || undefined, password: registerPassword });
        setMessage("Compte artisan cree. Validation admin requise.");
      } else {
        await registerUser({ firstName, lastName, email, password: registerPassword });
        setMessage("Compte fan/touriste cree avec succes.");
      }
      if (isAdmin) {
        await loadAdminData();
      }
    } catch (error) {
      let msg = "Erreur API inconnue";
      if (error instanceof Error && error.message) {
        msg = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        msg = String((error as { message?: unknown }).message || "Erreur API inconnue");
      }
      setMessage(msg);
      if (isAdmin) {
        await loadAdminData();
      }
    } finally {
      setBusy(false);
    }
  };

  const onSaveMonument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !isAdmin) return;
    await runAction(async () => {
      const payload = {
        name: monumentForm.name,
        slug: monumentForm.slug || undefined,
        category: monumentForm.category,
        city: monumentForm.city,
        shortDescription: monumentForm.shortDescription,
        history: monumentForm.history,
        anecdote: monumentForm.anecdote,
        bestVisitTime: monumentForm.bestVisitTime,
        recommendedDuration: monumentForm.recommendedDuration,
        localAdvice: monumentForm.localAdvice,
        photos: monumentForm.photosCsv.split(",").map((v) => v.trim()).filter(Boolean),
        location: { lat: Number(monumentForm.lat || 0), lng: Number(monumentForm.lng || 0), address: monumentForm.address },
      };

      if (monumentForm.id) await api.patch(`/api/monuments/${monumentForm.id}`, payload, token);
      else await api.post("/api/monuments", payload, token);

      setMonumentForm({
        id: "",
        name: "",
        slug: "",
        category: "General",
        city: "Fes",
        shortDescription: "",
        history: "",
        anecdote: "",
        bestVisitTime: "",
        recommendedDuration: "",
        localAdvice: "",
        photosCsv: "",
        lat: 0,
        lng: 0,
        address: "",
      });
      await loadAdminData();
    });
  };

  const onEditMonument = (m: Monument) => {
    setMonumentForm({
      id: m._id,
      name: m.name || "",
      slug: m.slug || "",
      category: m.category || "General",
      city: m.city || "Fes",
      shortDescription: m.shortDescription || "",
      history: m.history || "",
      anecdote: m.anecdote || "",
      bestVisitTime: m.bestVisitTime || "",
      recommendedDuration: m.recommendedDuration || "",
      localAdvice: m.localAdvice || "",
      photosCsv: (m.photos || []).join(", "),
      lat: Number(m.location?.lat || 0),
      lng: Number(m.location?.lng || 0),
      address: m.location?.address || "",
    });
  };

  const onDeleteMonument = async (id: string) => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.delete(`/api/monuments/${id}`, token);
      await loadAdminData();
    });
  };

  const onArtisanStatus = async (id: string, status: "accepted" | "rejected" | "suspended") => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.patch(`/api/admin/artisans/${id}/status`, { status }, token);
      setArtisans((prev) => prev.map((artisan) => (artisan._id === id ? { ...artisan, status } : artisan)));
      await loadAdminData();
    });
  };

  const onArtisanRecommended = async (id: string, recommended: boolean) => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.patch(`/api/admin/artisans/${id}/recommended`, { recommended }, token);
      setArtisans((prev) => prev.map((artisan) => (artisan._id === id ? { ...artisan, recommended } : artisan)));
      await loadAdminData();
    });
  };

  const onDeleteArtisan = async (id: string) => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.delete(`/api/admin/artisans/${id}`, token);
      setArtisans((prev) => prev.filter((artisan) => artisan._id !== id));
      await loadAdminData();
    });
  };

  const onSaveContent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !isAdmin) return;
    await runAction(async () => {
      const payload = {
        type: contentForm.type,
        name: contentForm.name,
        description: contentForm.description,
        imageUrl: contentForm.imageUrl,
        price: contentForm.price,
        contact: contentForm.contact,
        site: contentForm.site,
      };
      if (contentForm.id) await api.patch(`/api/admin/content/${contentForm.id}`, payload, token);
      else await api.post("/api/admin/content", payload, token);

      setContentForm({ id: "", type: "eshop", name: "", description: "", imageUrl: "", price: "", contact: "", site: "" });
      await loadAdminData();
    });
  };

  const onEditContent = (item: ContentItem) => {
    setContentForm({
      id: item._id,
      type: item.type,
      name: item.name || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      price: item.price || "",
      contact: item.contact || "",
      site: item.site || "",
    });
  };

  const onDeleteContent = async (id: string) => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.delete(`/api/admin/content/${id}`, token);
      setContentItems((prev) => prev.filter((item) => item._id !== id));
      await loadAdminData();
    });
  };

  const onProductStatus = async (id: string, status: "accepted" | "rejected") => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.patch(`/api/products/${id}/status`, { status }, token);
      await loadAdminData();
    });
  };

  const onProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || (!isArtisan && !isAdmin)) return;
    await runAction(async () => {
      await api.post("/api/products", {
        title: productForm.title,
        price: Number(productForm.price || 0),
        description: productForm.description,
        category: productForm.category,
        stock: Number(productForm.stock || 0),
        images: productForm.imageUrls.slice(0, 4),
      }, token);
      setProductForm({ title: "", price: 0, description: "", category: "autre", stock: 0, imageUrls: [] });
      setProductImageUrlInput("");
      setEditingProductId("");
      setMessage("Produit ajoute avec succes.");
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const onProductUpdate = async (id: string, patch: Partial<Product>) => {
    if (!token) return;
    await runAction(async () => {
      await api.patch(`/api/products/${id}`, patch, token);
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const onDeleteProduct = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Supprimer ce produit ?")) return;
    await runAction(async () => {
      await api.delete(`/api/products/${id}`, token);
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const onUploadProductImages = async (files: FileList | null) => {
    if (!files?.length || !token) return;
    if (productForm.imageUrls.length >= 4) {
      setMessage("Maximum 4 images par produit.");
      return;
    }

    const selected = Array.from(files).slice(0, 4 - productForm.imageUrls.length);
    const tooBig = selected.find((file) => file.size > 4 * 1024 * 1024);
    if (tooBig) {
      setMessage(`Image trop lourde (${tooBig.name}). Max 4MB.`);
      return;
    }

    const formData = new FormData();
    selected.forEach((file) => formData.append("images", file));

    setUploadingProductImages(true);
    await runAction(async () => {
      const uploaded = await api.post<{ images: string[] }>("/api/products/upload", formData, token);
      setProductForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...(uploaded.images || [])].slice(0, 4) }));
    }, "Upload image impossible.");
    setUploadingProductImages(false);
  };

  const onDropProductImages = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    await onUploadProductImages(event.dataTransfer.files);
  };

  const onAddProductImageUrl = () => {
    const nextUrl = productImageUrlInput.trim();
    if (!nextUrl) return;
    if (productForm.imageUrls.length >= 4) {
      setMessage("Maximum 4 images par produit.");
      return;
    }
    setProductForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, nextUrl].slice(0, 4) }));
    setProductImageUrlInput("");
  };

  const onRemoveProductImage = (index: number) => {
    setProductForm((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== index) }));
  };

  const onEditProduct = (product: Product) => {
    setEditingProductId(product._id);
    setProductForm({
      title: product.title || product.name || "",
      price: Number(product.price ?? product.priceDh ?? 0),
      description: product.description || "",
      category: product.category || "autre",
      stock: Number(product.stock || 0),
      imageUrls: (product.images?.length ? product.images : [product.imageUrl]).filter(Boolean).slice(0, 4),
    });
    setProductImageUrlInput("");
  };

  const onSaveProductEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !editingProductId) return;
    await runAction(async () => {
      await api.patch(`/api/products/${editingProductId}`, {
        title: productForm.title,
        price: Number(productForm.price || 0),
        description: productForm.description,
        category: productForm.category,
        stock: Number(productForm.stock || 0),
        images: productForm.imageUrls.slice(0, 4),
      }, token);
      setEditingProductId("");
      setProductForm({ title: "", price: 0, description: "", category: "autre", stock: 0, imageUrls: [] });
      setProductImageUrlInput("");
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const onCreateSouvenir = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    await runAction(async () => {
      await api.post("/api/souvenirs", { caption: productForm.title, imageUrl: productForm.imageUrls[0] || "" }, token);
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const onModerateSouvenir = async (id: string, isApproved: boolean) => {
    if (!token || !isAdmin) return;
    await runAction(async () => {
      await api.patch(`/api/souvenirs/${id}/moderation`, { isApproved }, token);
      await loadAdminData();
    });
  };

  const onReadMessage = async (id: string, source?: string) => {
    if (!token) return;
    await runAction(async () => {
      if (source === "product") await api.patch(`/api/messages/product/${id}/read`, {}, token);
      else await api.patch(`/api/messages/${id}/read`, {}, token);
      if (isAdmin) await loadAdminData();
      if (isArtisan) await loadArtisanData();
    });
  };

  const chartColors = ["#0f766e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#22c55e"];
  const productsByCategoryChart = {
    labels: dashboard?.charts.productsByCategory.map((i) => i.category) || [],
    datasets: [{ label: "Produits", data: dashboard?.charts.productsByCategory.map((i) => i.total) || [], backgroundColor: chartColors }],
  };
  const artisansByMonthChart = {
    labels: dashboard?.charts.artisansByMonth.map((i) => i.month) || [],
    datasets: [{ label: "Nouveaux artisans", data: dashboard?.charts.artisansByMonth.map((i) => i.total) || [], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,.25)", tension: 0.3 }],
  };
  const artisansByMonthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          callback: (value: number | string) => `${value}`,
        },
      },
    },
  };
  const monumentViewsChart = {
    labels: dashboard?.charts.monumentViews.map((i) => i.name) || [],
    datasets: [{ label: "Vues", data: dashboard?.charts.monumentViews.map((i) => i.views) || [], backgroundColor: "rgba(16,185,129,.7)" }],
  };
  const renderAdminContent = () => {
    if (!dashboard) return <div className={cardClass}>Chargement des donnees administrateur...</div>;

    if (adminSection === "dashboard") {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <div className={cardClass}><p className="text-xs text-muted-foreground">Monuments</p><p className="text-2xl font-bold">{dashboard.cards.monumentCount}</p></div>
            <div className={cardClass}><p className="text-xs text-muted-foreground">Artisans</p><p className="text-2xl font-bold">{dashboard.cards.artisanCount}</p></div>
            <div className={cardClass}><p className="text-xs text-muted-foreground">Produits</p><p className="text-2xl font-bold">{dashboard.cards.productCount}</p></div>
            <div className={cardClass}><p className="text-xs text-muted-foreground">Vues produits</p><p className="text-2xl font-bold">{dashboard.cards.productViews || 0}</p></div>
            <div className={cardClass}><p className="text-xs text-muted-foreground">Visiteurs</p><p className="text-2xl font-bold">{dashboard.cards.visitorCount}</p></div>
            <div className={cardClass}><p className="text-xs text-muted-foreground">Messages non lus</p><p className="text-2xl font-bold">{dashboard.cards.unreadMessages}</p></div>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <div className={`${cardClass} xl:col-span-2`}><h3 className="mb-3 font-semibold">Nouveaux artisans par mois</h3><div className="h-72"><Line data={artisansByMonthChart} options={artisansByMonthOptions} /></div></div>
            <div className={`${cardClass} xl:col-span-1`}><h3 className="mb-3 font-semibold">Produits par categorie</h3><Doughnut data={productsByCategoryChart} /></div>
          </div>
          <div className={cardClass}><h3 className="mb-3 font-semibold">Vues par monument</h3><Bar data={monumentViewsChart} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={cardClass}>
              <h3 className="mb-3 font-semibold">Produits les plus vus</h3>
              {(dashboard.topProducts || []).map((p) => (
                <div key={`${p.name}-${p.createdAt || ""}`} className="flex items-center justify-between py-1 text-sm">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.views} vues</span>
                </div>
              ))}
            </div>
            <div className={cardClass}>
              <h3 className="mb-3 font-semibold">Produits recents</h3>
              {(dashboard.latestProducts || []).map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="flex items-center justify-between py-1 text-sm">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{Number(p.priceDh || 0)} DH</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (adminSection === "monuments") {
      return (
        <div className="space-y-5">
          <form onSubmit={onSaveMonument} className={`${cardClass} grid gap-3 md:grid-cols-2`}>
            <h3 className="md:col-span-2 font-semibold">{monumentForm.id ? "Modifier monument" : "Ajouter monument"}</h3>
            <input value={monumentForm.name} onChange={(e) => setMonumentForm((s) => ({ ...s, name: e.target.value }))} placeholder="Nom" className="rounded-lg border border-input bg-background px-3 py-2" required />
            <input value={monumentForm.slug} onChange={(e) => setMonumentForm((s) => ({ ...s, slug: e.target.value }))} placeholder="Slug" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.city} onChange={(e) => setMonumentForm((s) => ({ ...s, city: e.target.value }))} placeholder="Ville" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.category} onChange={(e) => setMonumentForm((s) => ({ ...s, category: e.target.value }))} placeholder="Categorie" className="rounded-lg border border-input bg-background px-3 py-2" />
            <textarea value={monumentForm.shortDescription} onChange={(e) => setMonumentForm((s) => ({ ...s, shortDescription: e.target.value }))} placeholder="Description" className="md:col-span-2 min-h-20 rounded-lg border border-input bg-background px-3 py-2" />
            <textarea value={monumentForm.history} onChange={(e) => setMonumentForm((s) => ({ ...s, history: e.target.value }))} placeholder="Histoire" className="md:col-span-2 min-h-24 rounded-lg border border-input bg-background px-3 py-2" />
            <textarea value={monumentForm.anecdote} onChange={(e) => setMonumentForm((s) => ({ ...s, anecdote: e.target.value }))} placeholder="Anecdote" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.bestVisitTime} onChange={(e) => setMonumentForm((s) => ({ ...s, bestVisitTime: e.target.value }))} placeholder="Meilleur moment de visite" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.recommendedDuration} onChange={(e) => setMonumentForm((s) => ({ ...s, recommendedDuration: e.target.value }))} placeholder="Duree recommandee" className="rounded-lg border border-input bg-background px-3 py-2" />
            <textarea value={monumentForm.localAdvice} onChange={(e) => setMonumentForm((s) => ({ ...s, localAdvice: e.target.value }))} placeholder="Conseil local" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.address} onChange={(e) => setMonumentForm((s) => ({ ...s, address: e.target.value }))} placeholder="Adresse" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input type="number" value={monumentForm.lat} onChange={(e) => setMonumentForm((s) => ({ ...s, lat: Number(e.target.value) }))} placeholder="Latitude" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input type="number" value={monumentForm.lng} onChange={(e) => setMonumentForm((s) => ({ ...s, lng: Number(e.target.value) }))} placeholder="Longitude" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={monumentForm.photosCsv} onChange={(e) => setMonumentForm((s) => ({ ...s, photosCsv: e.target.value }))} placeholder="Photos URLs" className="md:col-span-2 rounded-lg border border-input bg-background px-3 py-2" />
            <button className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold">{monumentForm.id ? "Mettre a jour" : "Ajouter"}</button>
          </form>

          <div className={cardClass}>
            <div className="space-y-2">
              {monuments.map((m) => (
                <div key={m._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                  <div className="flex items-center gap-3">
                    <OptimizedImage src={m.photos?.[0] || ""} alt={m.name} className="h-10 w-10 rounded" sizes="40px" />
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.city} - vues: {m.views || 0}</p>
                      {m.shortDescription ? <p className="text-xs text-muted-foreground line-clamp-1">{m.shortDescription}</p> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onEditMonument(m)} className="rounded-md border border-border px-3 py-1 text-sm">Modifier</button>
                    <button type="button" onClick={() => void onDeleteMonument(m._id)} className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (adminSection === "artisans") {
      return (
        <div className={cardClass}>
          <h3 className="mb-3 font-semibold">Workflow validation artisans</h3>
          <div className="space-y-2">
            {artisans.map((a) => (
              <div key={a._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {a.firstName} {a.lastName}
                    {a.recommended ? <span className="inline-flex items-center text-sky-500" title="Artisan recommande"><FontAwesomeIcon icon={faCircleCheck} /></span> : null}
                  </p>
                  <p className="text-muted-foreground">{a.email || "-"} | produits: {a.productCount} | statut: {a.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void onArtisanStatus(a._id, "accepted")} className="rounded border px-2 py-1">Accepter</button>
                  <button onClick={() => void onArtisanStatus(a._id, "rejected")} className="rounded border px-2 py-1">Refuser</button>
                  <button onClick={() => void onArtisanStatus(a._id, "suspended")} className="rounded border px-2 py-1">Suspendre</button>
                  <button onClick={() => void onArtisanRecommended(a._id, !a.recommended)} className="rounded border px-2 py-1">{a.recommended ? "Retirer badge" : "Badge recommande"}</button>
                  <button onClick={() => void onDeleteArtisan(a._id)} className="rounded border border-red-300 px-2 py-1 text-red-700 inline-flex items-center gap-1"><FontAwesomeIcon icon={faTrashCan} /> Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (adminSection === "products") {
      return <div className={cardClass}><h3 className="mb-3 font-semibold">Produits en attente</h3>{pendingProducts.map((p) => <div key={p._id} className="mb-2 rounded border border-border p-2 text-sm"><p>{p.name} - {p.priceDh} DH ({p.category})</p><div className="mt-1 flex gap-2"><button onClick={() => void onProductStatus(p._id, "accepted")} className="rounded border px-2 py-1">Accepter</button><button onClick={() => void onProductStatus(p._id, "rejected")} className="rounded border px-2 py-1">Refuser</button></div></div>)}</div>;
    }

    if (adminSection === "content") {
      return (
        <div className="space-y-5">
          <form onSubmit={onSaveContent} className={`${cardClass} grid gap-3 md:grid-cols-2`}>
            <h3 className="md:col-span-2 font-semibold">{contentForm.id ? "Modifier contenu public" : "Ajouter contenu public"}</h3>
            <select value={contentForm.type} onChange={(e) => setContentForm((s) => ({ ...s, type: e.target.value }))} className="rounded-lg border border-input bg-background px-3 py-2">
              <option value="eshop">E-shop</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="riad">Riad</option>
            </select>
            <input value={contentForm.name} onChange={(e) => setContentForm((s) => ({ ...s, name: e.target.value }))} placeholder="Nom" className="rounded-lg border border-input bg-background px-3 py-2" required />
            <input value={contentForm.imageUrl} onChange={(e) => setContentForm((s) => ({ ...s, imageUrl: e.target.value }))} placeholder="Image URL" className="md:col-span-2 rounded-lg border border-input bg-background px-3 py-2" />
            <textarea value={contentForm.description} onChange={(e) => setContentForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="md:col-span-2 min-h-24 rounded-lg border border-input bg-background px-3 py-2" />
            <input value={contentForm.price} onChange={(e) => setContentForm((s) => ({ ...s, price: e.target.value }))} placeholder="Prix / tarif" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={contentForm.contact} onChange={(e) => setContentForm((s) => ({ ...s, contact: e.target.value }))} placeholder="Contact / Instagram / tel" className="rounded-lg border border-input bg-background px-3 py-2" />
            <input value={contentForm.site} onChange={(e) => setContentForm((s) => ({ ...s, site: e.target.value }))} placeholder="Lien site" className="md:col-span-2 rounded-lg border border-input bg-background px-3 py-2" />
            <button className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold">{contentForm.id ? "Mettre a jour" : "Ajouter"}</button>
          </form>

          <div className={cardClass}>
            <h3 className="mb-3 font-semibold">Contenu e-shop / restaurants / cafes / riads</h3>
            <div className="space-y-2">
              {contentItems.map((item) => (
                <div key={item._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <OptimizedImage src={item.imageUrl || ""} alt={item.name} className="h-10 w-10 rounded" sizes="40px" />
                    <div>
                      <p className="font-medium">{item.name} <span className="text-xs text-muted-foreground">({item.type})</span></p>
                      <p className="text-xs text-muted-foreground">{item.price || "-"} | {item.contact || "-"}</p>
                      {item.description ? <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onEditContent(item)} className="rounded-md border border-border px-3 py-1 text-sm">Modifier</button>
                    <button type="button" onClick={() => void onDeleteContent(item._id)} className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (adminSection === "gallery") {
      return <div className={cardClass}><h3 className="mb-3 font-semibold">Galerie / moderation</h3>{souvenirs.map((s) => <div key={s._id} className="mb-2 flex items-center justify-between rounded border border-border p-2 text-sm"><div className="flex items-center gap-2"><OptimizedImage src={s.imageUrl} alt={s.caption || "souvenir"} className="h-10 w-10 rounded" sizes="40px" /><span>{s.caption || "Sans legende"}</span></div><div className="flex gap-2"><button onClick={() => void onModerateSouvenir(s._id, true)} className="rounded border px-2 py-1">Valider</button><button onClick={() => void onModerateSouvenir(s._id, false)} className="rounded border px-2 py-1">Masquer</button></div></div>)}</div>;
    }

    if (adminSection === "reviews") {
      const comments = souvenirs.flatMap((s) => s.comments.map((c) => ({ id: `${s._id}-${c._id}`, caption: s.caption, text: c.text })));
      return <div className={cardClass}><h3 className="mb-3 font-semibold">Avis & commentaires</h3>{comments.map((c) => <div key={c.id} className="mb-2 rounded border border-border p-2 text-sm"><p className="font-medium">{c.caption || "Souvenir"}</p><p className="text-muted-foreground">{c.text}</p></div>)}</div>;
    }

    if (adminSection === "users") {
      return <div className={cardClass}><h3 className="mb-3 font-semibold">Utilisateurs</h3>{users.map((u) => <div key={u._id} className="mb-2 rounded border border-border p-2 text-sm"><p>{u.firstName} {u.lastName} - {u.role}</p><p className="text-muted-foreground">{u.email || "-"} | {u.status || "-"}</p></div>)}</div>;
    }

    return <div className={cardClass}><button onClick={toggleTheme} className="rounded border px-3 py-2 text-sm"><FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="mr-2" />{theme === "dark" ? "Passer en clair" : "Passer en sombre"}</button></div>;
  };

  const renderArtisanContent = () => {
    if (artisanSection === "dashboard") {
      return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className={cardClass}><p className="text-xs text-muted-foreground">Total produits</p><p className="text-2xl font-bold">{artisanStats.totalProducts}</p></div><div className={cardClass}><p className="text-xs text-muted-foreground">Total vues</p><p className="text-2xl font-bold">{artisanStats.totalViews}</p></div><div className={cardClass}><p className="text-xs text-muted-foreground">Messages recus</p><p className="text-2xl font-bold">{messages.length}</p></div><div className={cardClass}><p className="text-xs text-muted-foreground">Non lus</p><p className="text-2xl font-bold">{artisanStats.unreadMessages}</p></div></div>;
    }

    if (artisanSection === "products") {
      return (
        <div className="space-y-3">
          <div className={cardClass}>
            <h3 className="mb-3 font-semibold">Mes produits</h3>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p._id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <OptimizedImage src={p.images?.[0] || p.imageUrl || ""} alt={p.title || p.name || "Produit"} className="h-12 w-12 rounded" sizes="48px" />
                      <div>
                        <p className="font-medium">{p.title || p.name}</p>
                        <p className="text-xs text-muted-foreground">{Number(p.price ?? p.priceDh ?? 0)} DH • {p.views || 0} vues • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onEditProduct(p)} className="rounded border px-2 py-1">Modifier</button>
                      <button type="button" onClick={() => void onDeleteProduct(p._id)} className="rounded border border-red-300 px-2 py-1 text-red-700">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editingProductId ? (
            <form onSubmit={onSaveProductEdit} className={`${cardClass} grid gap-3 md:grid-cols-2`}>
              <h3 className="md:col-span-2 font-semibold">Modifier produit</h3>
              <input value={productForm.title} onChange={(e) => setProductForm((s) => ({ ...s, title: e.target.value }))} placeholder="Titre" className="rounded-lg border border-input bg-background px-3 py-2" required />
              <input type="number" min={0} value={productForm.price} onChange={(e) => setProductForm((s) => ({ ...s, price: Number(e.target.value) }))} placeholder="Prix" className="rounded-lg border border-input bg-background px-3 py-2" required />
              <input value={productForm.category} onChange={(e) => setProductForm((s) => ({ ...s, category: e.target.value }))} placeholder="Categorie" className="rounded-lg border border-input bg-background px-3 py-2" />
              <input type="number" min={0} value={productForm.stock} onChange={(e) => setProductForm((s) => ({ ...s, stock: Number(e.target.value) }))} placeholder="Stock" className="rounded-lg border border-input bg-background px-3 py-2" />
              <textarea value={productForm.description} onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="md:col-span-2 min-h-24 rounded-lg border border-input bg-background px-3 py-2" />
              <button className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold">Enregistrer</button>
            </form>
          ) : null}
        </div>
      );
    }

    if (artisanSection === "add") {
      return (
        <form onSubmit={onProductSubmit} className={`${cardClass} grid gap-3 md:grid-cols-2`}>
          <h3 className="md:col-span-2 font-semibold">Ajouter produit</h3>
          <input value={productForm.title} onChange={(e) => setProductForm((s) => ({ ...s, title: e.target.value }))} placeholder="Titre" className="rounded-lg border border-input bg-background px-3 py-2" required />
          <input type="number" min={0} value={productForm.price} onChange={(e) => setProductForm((s) => ({ ...s, price: Number(e.target.value) }))} placeholder="Prix" className="rounded-lg border border-input bg-background px-3 py-2" required />
          <input value={productForm.category} onChange={(e) => setProductForm((s) => ({ ...s, category: e.target.value }))} placeholder="Categorie" className="rounded-lg border border-input bg-background px-3 py-2" />
          <input type="number" min={0} value={productForm.stock} onChange={(e) => setProductForm((s) => ({ ...s, stock: Number(e.target.value) }))} placeholder="Stock (optionnel)" className="rounded-lg border border-input bg-background px-3 py-2" />
          <textarea value={productForm.description} onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="md:col-span-2 min-h-24 rounded-lg border border-input bg-background px-3 py-2" />

          <div
            className="md:col-span-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground"
            onDrop={(e) => void onDropProductImages(e)}
            onDragOver={(e) => e.preventDefault()}
          >
            Glisser/deposer images ici (max 4, 4MB chacune) ou choisir des fichiers.
            <input type="file" accept="image/*" multiple onChange={(e) => void onUploadProductImages(e.target.files)} className="mt-2 block" />
            {uploadingProductImages ? <p className="mt-2 text-xs">Upload en cours...</p> : null}
          </div>

          <div className="md:col-span-2 grid gap-2 md:grid-cols-[1fr_auto]">
            <input value={productImageUrlInput} onChange={(e) => setProductImageUrlInput(e.target.value)} placeholder="Ou coller URL image" className="rounded-lg border border-input bg-background px-3 py-2" />
            <button type="button" onClick={onAddProductImageUrl} className="rounded-lg border border-border px-3 py-2">Ajouter URL</button>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {productForm.imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative rounded-lg overflow-hidden border border-border">
                <OptimizedImage src={url} alt={`img-${index}`} className="h-24 w-full" sizes="120px" />
                <button type="button" onClick={() => onRemoveProductImage(index)} className="absolute top-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">x</button>
              </div>
            ))}
          </div>

          <button className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold">Ajouter produit</button>
        </form>
      );
    }

    if (artisanSection === "gallery") {
      return <div className="space-y-3"><form onSubmit={onCreateSouvenir} className={`${cardClass} grid gap-3 md:grid-cols-2`}><input value={productForm.title} onChange={(e) => setProductForm((s) => ({ ...s, title: e.target.value }))} placeholder="Legende" className="rounded border border-input px-3 py-2" /><input value={productForm.imageUrls[0] || ""} onChange={(e) => setProductForm((s) => ({ ...s, imageUrls: [e.target.value, ...s.imageUrls.slice(1)] }))} placeholder="Image URL" className="rounded border border-input px-3 py-2" /><button className="md:col-span-2 rounded bg-primary px-3 py-2 text-primary-foreground">Publier</button></form><div className={cardClass}>{souvenirs.map((s) => <div key={s._id} className="mb-2 rounded border border-border p-2 text-sm">{s.caption || "Sans legende"} - {s.isApproved ? "Valide" : "En attente"}</div>)}</div></div>;
    }

    if (artisanSection === "messages") {
      return <div className={cardClass}>{messages.map((m) => <div key={m._id} className="mb-2 rounded border border-border p-2 text-sm"><div className="flex items-center justify-between"><p className="font-medium">{m.subject || "Message visiteur"}</p>{!m.readAt ? <button onClick={() => void onReadMessage(m._id, m.source)} className="text-xs underline">Marquer lu</button> : <span className="text-xs text-muted-foreground">Lu</span>}</div><p className="text-muted-foreground">{m.content}</p></div>)}</div>;
    }

    return <div className={cardClass}><p className="text-sm">{user?.firstName} {user?.lastName}</p><p className="text-xs text-muted-foreground">Boutique: {user?.shopName || "-"} | Statut: {user?.status || "accepted"}</p></div>;
  };
    const renderAuth = () => (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      {authView === "login" ? (
        <form onSubmit={onLogin} className="space-y-3">
          <h2 className="text-2xl font-bold">Connexion</h2>
          <p className="text-sm text-muted-foreground">Email, CIN ou code artisan + mot de passe.</p>
          <input value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="Email / CIN / code artisan" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          <input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Mot de passe" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2.5 text-primary-foreground font-semibold">{busy ? "Connexion..." : "Se connecter"}</button>
          <button type="button" onClick={() => setAuthView("register")} className="w-full rounded-lg border border-border px-4 py-2 text-sm">S'inscrire</button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="space-y-3">
          <h2 className="text-2xl font-bold">Inscription</h2>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
            <button type="button" onClick={() => setRegisterRole("artisan")} className={`rounded-md px-3 py-2 text-sm font-semibold ${registerRole === "artisan" ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
              Artisan
            </button>
            <button type="button" onClick={() => setRegisterRole("user")} className={`rounded-md px-3 py-2 text-sm font-semibold ${registerRole === "user" ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
              Fan / Touriste
            </button>
          </div>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prenom" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          {registerRole === "artisan" ? (
            <>
              <input value={cin} onChange={(e) => setCin(e.target.value)} placeholder="CIN" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
              <input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Nom de boutique" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
              <input value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} placeholder="Adresse boutique" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optionnel)" className="w-full rounded-lg border border-input bg-background px-3 py-2" />
            </>
          ) : (
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          )}
          <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Mot de passe" className="w-full rounded-lg border border-input bg-background px-3 py-2" required />
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2.5 text-primary-foreground font-semibold">{busy ? "Creation..." : registerRole === "artisan" ? "Creer compte artisan" : "Creer compte fan/touriste"}</button>
          <button type="button" onClick={() => setAuthView("login")} className="w-full rounded-lg border border-border px-4 py-2 text-sm">Retour connexion</button>
        </form>
      )}
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );

  const renderWorkspace = () => {
    if (!user) return null;
    const isAdminView = user.role === "admin";
    const menu = isAdminView ? adminMenu : artisanMenu;

    const menuSidebar = (
      <aside className="rounded-2xl bg-slate-900 p-4 text-slate-100 shadow-md">
        <div className="mb-4 border-b border-slate-700 pb-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">{t("portal.secureSpace")}</p>
          <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-slate-400">{t("portal.role")}: {user.role}</p>
        </div>
        <nav className="space-y-1">
          {menu.map((item) => {
            const active = isAdminView ? adminSection === item.id : artisanSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isAdminView) setAdminSection(item.id as AdminSection);
                  else setArtisanSection(item.id as ArtisanSection);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${active ? "bg-slate-100 text-slate-900" : "text-slate-200 hover:bg-slate-800"}`}
              >
                <FontAwesomeIcon icon={item.icon} className={`${isRtl ? "ml-2" : "mr-2"}`} />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 space-y-2">
          <button onClick={toggleTheme} className="w-full rounded-lg border border-slate-600 px-3 py-2 text-left text-sm"><FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className={`${isRtl ? "ml-2" : "mr-2"}`} />{theme === "dark" ? t("common.lightMode") : t("common.darkMode")}</button>
          <button onClick={logout} className="w-full rounded-lg border border-slate-600 px-3 py-2 text-left text-sm"><FontAwesomeIcon icon={faXmark} className={`${isRtl ? "ml-2" : "mr-2"}`} />{t("common.logout")}</button>
        </div>
      </aside>
    );

    return (
      <div className={`grid gap-4 ${isRtl ? "lg:grid-cols-[minmax(0,1fr)_260px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"}`}>
        <div className={`lg:hidden ${isRtl ? "text-right" : ""}`}>
          <button type="button" onClick={() => setMobileSidebarOpen(true)} className="rounded-lg border border-border px-4 py-2 text-sm">
            {t("nav.menu")}
          </button>
        </div>
        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
            <div className={`h-full w-[88%] max-w-xs p-3 ${isRtl ? "mr-auto" : "ml-auto"}`} onClick={(event) => event.stopPropagation()}>
              {menuSidebar}
            </div>
          </div>
        ) : null}

        <div className={`hidden lg:block ${isRtl ? "lg:order-2" : "lg:order-1"}`}>{menuSidebar}</div>

        <section className={`space-y-4 ${isRtl ? "lg:order-1" : "lg:order-2"}`}>
          {message ? <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">{message}</div> : null}
          {isAdminView ? renderAdminContent() : renderArtisanContent()}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">Portail professionnel</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{t("portal.title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("portal.subtitle")}</p>
        </div>

        {!isAuthenticated ? renderAuth() : renderWorkspace()}
      </main>
      <Footer />
    </div>
  );
};

export default PortalPage;


