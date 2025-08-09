// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta as any).env?.REACT_APP_API_URL ||
    "http://localhost:5000",
});

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

// opcional (se tiver endpoint no back). Se não tiver, o front faz fallback por /my-pets.
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

export const getPostsByPetId = (petId: string) =>
  api.get<PostDTO[]>(`/api/posts/${petId}`);

export const createPostForPet = (
  petId: string,
  payload: { type: "image" | "video" | "text"; media?: string; caption?: string }
) => api.post<PostDTO>(`/api/posts/${petId}`, payload);

// ----- Pet Ativo (localStorage) -----
export const setActivePet = (pet: Pet) =>
  localStorage.setItem("activePet", JSON.stringify(pet));

export const getActivePet = (): Pet | null => {
  const raw = localStorage.getItem("activePet");
  return raw ? (JSON.parse(raw) as Pet) : null;
};

export const clearActivePet = () => localStorage.removeItem("activePet");
