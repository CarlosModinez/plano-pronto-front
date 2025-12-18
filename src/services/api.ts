import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, LessonPlanRequest, Material, MaterialsResponse } from '../types';

const API_URL = 'https://plano-aula-generator-4ebcc32db1d8.herokuapp.com/';

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
  changePassword: async (newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { new_password: newPassword });
  },
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (token: string, newPassword: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/reset-password', { token, new_password: newPassword });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

export const materialService = {
  create: async (data: LessonPlanRequest): Promise<Material> => {
    const response = await api.post<Material>('/materials', data);
    return response.data;
  },
  list: async (): Promise<MaterialsResponse> => {
    const response = await api.get<MaterialsResponse>('/materials');
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

export const annualPlanService = {
  create: async (data: any): Promise<any> => {
    const response = await api.post('/annual-plans', data);
    return response.data;
  },
  list: async (): Promise<any> => {
    const response = await api.get('/annual-plans');
    return response.data;
  },
  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/annual-plans/${id}`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/annual-plans/${id}`);
  },
};

export const didacticSequenceService = {
  create: async (data: any): Promise<any> => {
    const response = await api.post('/sequences', data);
    return response.data;
  },
  list: async (): Promise<any> => {
    const response = await api.get('/sequences');
    return response.data;
  },
  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/sequences/${id}`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sequences/${id}`);
  },
};

export const activityGeneratorService = {
  create: async (data: any): Promise<any> => {
    const response = await api.post('/activities', data);
    return response.data;
  },
  list: async (): Promise<any> => {
    const response = await api.get('/activities');
    return response.data;
  },
  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};

export const studentReportService = {
  create: async (data: any): Promise<any> => {
    const response = await api.post('/reports', data);
    return response.data;
  },
  list: async (): Promise<any> => {
    const response = await api.get('/reports');
    return response.data;
  },
  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};

export default api;
