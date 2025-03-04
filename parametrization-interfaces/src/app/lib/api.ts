import axios from "axios";

// Configurar instancia de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Usa variables de entorno
  headers: { "Content-Type": "application/json" },
});

// Agregar interceptor para incluir el token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiGet = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

export const apiPost = async (url: string, data: any) => {
  const res = await api.post(url, data);
  return res.data;
};

export const apiPatch = async (url: string, data: any) => {
  const res = await api.patch(url, data);
  return res.data;
};

export const apiDelete = async (url: string) => {
  const res = await api.delete(url);
  return res.data;
};

export default api;
