import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getTransactions = (userId) => api.get("/transactions", { params: { user: userId } });
export const createTransaction = (transaction) => api.post("/transactions", transaction);
export const updateTransaction = (id, transaction, userId) =>
  api.put(`/transactions/${id}`, transaction, { params: { user: userId } });
export const deleteTransaction = (id, userId) =>
  api.delete(`/transactions/${id}`, { params: { user: userId } });
export const signupUser = (user) => api.post("/auth/signup", user);
export const loginUser = (credentials) => api.post("/auth/login", credentials);

export default api;
