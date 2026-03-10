const importers: Record<string, () => Promise<unknown>> = {
  "/about": () => import("@/pages/AboutPage"),
  "/outils": () => import("@/pages/ToolsPage"),
  "/boutique": () => import("@/pages/ShopPage"),
  "/souvenirs": () => import("@/pages/SouvenirsPage"),
  "/portail": () => import("@/pages/PortalPage"),
};

const prefetched = new Set<string>();

export const prefetchRoute = (to: string) => {
  const importer = importers[to];
  if (!importer || prefetched.has(to)) {
    return;
  }

  prefetched.add(to);
  void importer().catch(() => {
    prefetched.delete(to);
  });
};

