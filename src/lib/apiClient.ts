const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

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
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    // Local fallback: if absolute API base fails, retry through Vite proxy (/api).
    if (API_BASE) {
      try {
        res = await fetch(path, {
          ...options,
          headers,
        });
      } catch {
        throw new ApiError("API indisponible. Verifiez que le serveur backend tourne sur le bon port.", 0);
      }
    } else {
      throw new ApiError("API indisponible. Verifiez que le serveur backend tourne sur le bon port.", 0);
    }
  }

  const data = (await res.json().catch(() => ({}))) as { message?: string } & T;
  if (!res.ok) {
    throw new ApiError(data?.message || "Erreur API", res.status);
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
