import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export async function predictTravelTime(payload) {
  const { data } = await api.post("/api/predict", payload);
  return data;
}

export default api;
