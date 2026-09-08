// ─── API Client ───────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("paradise_token");
}

/** Clear auth data and redirect to login on 401 */
function handleUnauthorized(): never {
  localStorage.removeItem("paradise_token");
  localStorage.removeItem("paradise_username");
  window.location.href = "/admin/login";
  throw new Error("Session expired. Please log in again.");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Auto-logout on expired / invalid token for protected routes
  if (res.status === 401 && path !== "/auth/login") {
    handleUnauthorized();
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((error as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Public API ────────────────────────────────────────────────────────────────
export const api = {
  getProfile: () => request<import("./types").SiteSettings>("/profile"),
  getActivities: () => request<import("./types").Activity[]>("/activities"),
  getGallery: () => request<import("./types").GalleryItem[]>("/gallery"),
  getOfficers: () => request<import("./types").Officer[]>("/officers"),
  getContact: () => request<import("./types").Contact>("/contact"),
};

// ─── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    request<import("./types").AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  me: () => request<{ id: number; username: string }>("/auth/me"),

  logout: () => request("/auth/logout", { method: "POST" }),
};

// ─── Admin API ─────────────────────────────────────────────────────────────────
export const adminApi = {
  // Profile
  getProfile: () => request<import("./types").SiteSettings>("/profile"),
  updateProfile: (data: Partial<import("./types").SiteSettings>) =>
    request<import("./types").SiteSettings>("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Activities
  getActivities: () => request<import("./types").Activity[]>("/admin/activities"),
  createActivity: (data: Omit<import("./types").Activity, "id" | "createdAt">) =>
    request<import("./types").Activity>("/admin/activities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateActivity: (id: number, data: Partial<import("./types").Activity>) =>
    request<import("./types").Activity>(`/admin/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteActivity: (id: number) =>
    request<{ success: boolean }>(`/admin/activities/${id}`, {
      method: "DELETE",
    }),

  // Gallery
  getGallery: () => request<import("./types").GalleryItem[]>("/admin/gallery"),
  createGalleryItem: (data: Omit<import("./types").GalleryItem, "id" | "createdAt">) =>
    request<import("./types").GalleryItem>("/admin/gallery", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGalleryItem: (id: number, data: Partial<import("./types").GalleryItem>) =>
    request<import("./types").GalleryItem>(`/admin/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteGalleryItem: (id: number) =>
    request<{ success: boolean }>(`/admin/gallery/${id}`, {
      method: "DELETE",
    }),

  // Officers
  getOfficers: () => request<import("./types").Officer[]>("/admin/officers"),
  createOfficer: (data: Omit<import("./types").Officer, "id" | "createdAt">) =>
    request<import("./types").Officer>("/admin/officers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateOfficer: (id: number, data: Partial<import("./types").Officer>) =>
    request<import("./types").Officer>(`/admin/officers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteOfficer: (id: number) =>
    request<{ success: boolean }>(`/admin/officers/${id}`, {
      method: "DELETE",
    }),

  // Contact
  getContact: () => request<import("./types").Contact>("/admin/contact"),
  updateContact: (data: Partial<import("./types").Contact>) =>
    request<import("./types").Contact>("/admin/contact", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // File Upload
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (res.status === 401) handleUnauthorized();

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error((error as { error?: string }).error ?? "Upload failed");
    }

    return res.json() as Promise<{ url: string }>;
  },
};
