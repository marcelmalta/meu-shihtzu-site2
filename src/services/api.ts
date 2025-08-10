// src/services/api.ts
import axios from "axios";

// ====== Base URL (Vite) ======
export const API_BASE =
  import.meta.env.VITE_API_URL?.toString() || "http://localhost:3000";

// ====== Axios instance ======
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // cookies/sessão cross-site
  headers: { "Content-Type": "application/json" },
});

// ====== Auth Token Helpers (opcional: Bearer) ======
const AUTH_KEY = "auth_token";

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem(AUTH_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(AUTH_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

// Restaurar token ao carregar
const savedToken = localStorage.getItem(AUTH_KEY);
if (savedToken) setAuthToken(savedToken);

// ====== Pet Helpers (usados no Header.tsx) ======
const ACTIVE_PET_KEY = "active_pet";

export type Pet = {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
};

export function getActivePet(): Pet | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PET_KEY);
    return raw ? (JSON.parse(raw) as Pet) : null;
  } catch {
    return null;
  }
}
export function setActivePet(pet: Pet) {
  localStorage.setItem(ACTIVE_PET_KEY, JSON.stringify(pet));
  window.dispatchEvent(new StorageEvent("storage")); // para sincronizar menus
}
export function clearActivePet() {
  localStorage.removeItem(ACTIVE_PET_KEY);
  window.dispatchEvent(new StorageEvent("storage"));
}

// ====== API helpers ======
export async function getPosts() {
  // tente padrões comuns
  const endpoints = ["/api/posts", "/api/feed"];
  for (const ep of endpoints) {
    try {
      const { data } = await api.get(ep);
      // aceitar {data: []} | [] | {posts: []}
      const arr = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : data?.posts;
      if (Array.isArray(arr)) return arr;
    } catch {
      // tenta o próximo
    }
  }
  throw new Error("Não foi possível carregar posts do servidor.");
}
