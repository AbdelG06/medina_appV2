import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatbotButton from "@/components/ChatbotButton";
import { EmergencyButton } from "@/components/EmergencyButton";
import { AppSettingsProvider } from "@/contexts/AppSettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";

const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const GateDetail = React.lazy(() => import("./pages/GateDetail"));
const ToolsPage = React.lazy(() => import("./pages/ToolsPage"));
const PortalPage = React.lazy(() => import("./pages/PortalPage"));
const MonumentDetailPage = React.lazy(() => import("./pages/MonumentDetailPage"));
const SouvenirsPage = React.lazy(() => import("./pages/SouvenirsPage"));
const ShopPage = React.lazy(() => import("./pages/ShopPage"));
const EshopPage = React.lazy(() => import("./pages/EshopPage"));
const ArtisanShopPage = React.lazy(() => import("./pages/ArtisanShopPage"));
const ProductPublicPage = React.lazy(() => import("./pages/ProductPublicPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep cached data fresh enough without excessive refetches on tab focus/reconnect.
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "Une erreur inconnue est survenue.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("Runtime error caught by AppErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-xl w-full rounded-xl border border-border bg-card p-6">
            <h1 className="font-heading text-2xl mb-3">Erreur d'affichage</h1>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Un composant a plante au runtime. Recharge la page apres correction.
            </p>
            <pre className="font-body text-xs whitespace-pre-wrap break-words bg-muted p-3 rounded-md">
              {this.state.errorMessage}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <AppSettingsProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <ScrollToTop />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/porte/:slug" element={<GateDetail />} />
                  <Route path="/outils" element={<ToolsPage />} />
                  <Route path="/portail" element={<PortalPage />} />
                  <Route path="/boutique" element={<ShopPage />} />
                  <Route path="/eshop" element={<ShopPage />} />
                  <Route path="/shop/:artisanId" element={<ArtisanShopPage />} />
                  <Route path="/product/:id" element={<ProductPublicPage />} />
                  <Route path="/monument/:slug" element={<MonumentDetailPage />} />
                  <Route path="/souvenirs" element={<SouvenirsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <ChatbotButton />
              <EmergencyButton />
            </BrowserRouter>
          </AppErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </AppSettingsProvider>
);

export default App;
