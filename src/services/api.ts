import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
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
export const getMyPets = () => api.get("/api/pets/my-pets");
export const createPet = (payload: { name: string; bio?: string; avatar?: string }) =>
  api.post("/api/pets/create", payload);

// ----- Pet Ativo (localStorage) -----
export const setActivePet = (pet: any) =>
  localStorage.setItem("activePet", JSON.stringify(pet));

export const getActivePet = () => {
  const raw = localStorage.getItem("activePet");
  return raw ? JSON.parse(raw) : null;
};

export const clearActivePet = () => localStorage.removeItem("activePet");
