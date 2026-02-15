import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ChatbotButton from "@/components/ChatbotButton";
import { EmergencyButton } from "@/components/EmergencyButton";

const queryClient = new QueryClient();

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
    // Keep error visible in devtools while showing a fallback UI.
    console.error("Runtime error caught by AppErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-xl w-full rounded-xl border border-border bg-card p-6">
            <h1 className="font-heading text-2xl mb-3">Erreur d'affichage</h1>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Un composant a planté au runtime. Recharge la page après correction.
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Floating buttons always visible */}
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}>
            <div style={{ marginBottom: 16 }}>
              <ChatbotButton />
            </div>
            <EmergencyButton />
          </div>
        </BrowserRouter>
      </AppErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
