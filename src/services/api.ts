// src/services/api.ts
import axios, { AxiosError } from "axios";

/**
 * Vite: variáveis começam com VITE_
 * Acesse com import.meta.env.VITE_API_URL
 * (Sem barras no final)
 */
const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");

if (!API_URL) {
  console.warn("[api] VITE_API_URL não definida. Usando http://localhost:5000");
}

export const api = axios.create({
  baseURL: API_URL || "http://localhost:5000",
  timeout: 10000, // 10s
});

/** Seta/limpa header Authorization + persiste token */
export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

// carregar token salvo ao iniciar
const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);

/* ------------ Interceptors ------------ */
// Request: garante Authorization sempre atualizado
api.interceptors.request.use((config) => {
  const tk = localStorage.getItem("token");
  if (tk) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${tk}`;
  }
  return config;
});

// Response: trata 401 globalmente
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    const status = err.response?.status;
    if (status === 401) {
      setAuthToken(undefined);
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

/* ------------- Endpoints -------------- */
// ----- Auth -----
export const registerUser = (name: string, email: string, password: string) =>
  api.post("/api/auth/register", { name, email, password });

export const loginUser = (email: string, password: string) =>
  api.post("/api/auth/login", { email, password });

// ----- Pets -----
export type Pet = { _id: string; name: string; avatar?: string; bio?: string; owner?: string };

export const getMyPets = () => api.get<Pet[]>("/api/pets/my-pets");
export const createPet = (payload: { name: string; bio?: string; avatar?: string }) =>
  api.post<Pet>("/api/pets/create", payload);
// opcional (se você tiver o endpoint no back):
export const getPetById = (id: string) => api.get<Pet>(`/api/pets/${id}`);

// ----- Posts -----
export type PostDTO = {
  _id: string;
  petId: string;
  type: "image" | "video" | "text";
  media?: string;
  caption?: string;
  createdAt: string;
};

export const getPostsByPetId = (petId: string) => api.get<PostDTO[]>(`/api/posts/${petId}`);
export const createPostForPet = (
  petId: string,
  payload: { type: "image" | "video" | "text"; media?: string; caption?: string }
) => api.post<PostDTO>(`/api/posts/${petId}`, payload);

// ----- Upload (S3/R2 via backend) -----
// petId opcional: backend pode usar pra compor a chave no bucket
export const uploadMedia = (file: File, petId?: string) => {
  const fd = new FormData();
  fd.append("file", file);
  if (petId) fd.append("petId", petId);
  return api.post<{ url: string; filename: string; mimetype: string; size: number }>(
    "/api/upload",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// ----- Pet Ativo (localStorage) -----
export const setActivePet = (pet: Pet) =>
  localStorage.setItem("activePet", JSON.stringify(pet));

export const getActivePet = (): Pet | null => {
  const raw = localStorage.getItem("activePet");
  return raw ? (JSON.parse(raw) as Pet) : null;
};

export const clearActivePet = () => localStorage.removeItem("activePet");
