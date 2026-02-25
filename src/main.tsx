import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

const initialLang = window.localStorage.getItem("fes-language") === "ar" ? "ar" : "fr";
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
document.body.classList.toggle("rtl", initialLang === "ar");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' introuvable dans index.html.");
}

const renderFatalError = (title: string, message: string) => {
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f8f5ee;color:#2f241c;font-family:Arial,sans-serif;">
      <div style="max-width:760px;width:100%;background:#fff;border:1px solid #ddd;border-radius:12px;padding:20px;">
        <h1 style="margin:0 0 12px;font-size:22px;">${title}</h1>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;background:#f3f3f3;padding:12px;border-radius:8px;">${message}</pre>
      </div>
    </div>
  `;
};

window.addEventListener("error", (event) => {
  const msg = event.error?.stack || event.message || "Erreur JavaScript inconnue.";
  renderFatalError("Erreur runtime", msg);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const msg =
    typeof reason === "string"
      ? reason
      : reason?.stack || reason?.message || JSON.stringify(reason);
  renderFatalError("Promesse rejetée", msg);
});

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  const msg = error instanceof Error ? error.stack || error.message : String(error);
  renderFatalError("Erreur au montage React", msg);
}
