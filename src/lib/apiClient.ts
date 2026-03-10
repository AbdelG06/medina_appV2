const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const canRetryWithRelativeApi =
  !API_BASE ||
  API_BASE.startsWith("/") ||
  /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(API_BASE);

const joinApiUrl = (base: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }

  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  if (normalizedBase === "/api" && normalizedPath.startsWith("/api/")) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const isFormData = (value: unknown): value is FormData => typeof FormData !== "undefined" && value instanceof FormData;

const request = async <T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> => {
  const shouldSendJsonContentType = !isFormData(options.body);
  const headers = {
    ...(shouldSendJsonContentType ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res: Response;
  try {
    res = await fetch(joinApiUrl(API_BASE, path), {
      ...options,
      headers,
    });
  } catch {
    // Dev fallback: if direct backend URL fails, retry via Vite proxy (/api).
    if (canRetryWithRelativeApi) {
      try {
        res = await fetch(path, {
          ...options,
          headers,
        });
      } catch {
        throw new ApiError("API indisponible. Verifie `npm run api`, le port 3001 et l'acces MongoDB Atlas (IP whitelist).", 0);
      }
    } else {
      throw new ApiError("API indisponible. Verifie `npm run api`, le port 3001 et l'acces MongoDB Atlas (IP whitelist).", 0);
    }
  }

  const rawBody = await res.text();
  let data = {} as { message?: string } & T;
  if (rawBody) {
    try {
      data = JSON.parse(rawBody) as { message?: string } & T;
    } catch {
      data = { message: rawBody } as { message?: string } & T;
    }
  }

  if (!res.ok) {
    throw new ApiError((data?.message || "").trim() || `Erreur API (${res.status})`, res.status);
  }
  return data;
};

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: "GET" }, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: isFormData(body) ? body : JSON.stringify(body) }, token),
  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body: isFormData(body) ? body : JSON.stringify(body) }, token),
  delete: <T>(path: string, token?: string | null) => request<T>(path, { method: "DELETE" }, token),
};
