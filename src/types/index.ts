export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LessonPlanRequest {
  discipline: string;
  serie: string;
  theme: string;
  duration: number;
  additional_context?: string;
}

export interface Material {
  id: string;
  discipline: string;
  serie: string;
  theme: string;
  duration: number;
  additional_context?: string;
  
  // Generated fields
  foundation?: string;
  general_objective?: string;
  specific_objectives?: string[];
  skills?: string[];
  content?: string[];
  resources?: string[];
  methodology?: string[];
  evaluation?: string;
  homework?: string[];
  adaptations?: string[];
  
  created_at: string;
}
