export const notFoundHandler = (_req, res) => {
  return res.status(404).json({ message: "Route API introuvable." });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Erreur serveur interne.";
  return res.status(status).json({ message });
};
