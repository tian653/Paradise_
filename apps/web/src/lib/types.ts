// ─── API Types ────────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: number;
  communityName: string;
  tagline: string;
  shortDescription: string;
  about: string;
  history: string;
  vision: string;
  mission: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  updatedAt: string;
}

export interface Activity {
  id: number;
  name: string;
  date: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Officer {
  id: number;
  name: string;
  position: string;
  photoUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Contact {
  id: number;
  instagram: string | null;
  whatsapp: string | null;
  email: string | null;
  additional: AdditionalLink[];
  updatedAt: string;
}

export interface AdditionalLink {
  label: string;
  url: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}
