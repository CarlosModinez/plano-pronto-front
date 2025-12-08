import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, LessonPlanRequest, Material } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const materialService = {
  create: async (data: LessonPlanRequest): Promise<Material> => {
    const response = await api.post<Material>('/materials', data);
    return response.data;
  },
  list: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/materials');
    return response.data;
  },
  getById: async (id: string): Promise<Material> => {
    const response = await api.get<Material>(`/materials/${id}`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/materials/${id}`);
  },
};

export default api;
