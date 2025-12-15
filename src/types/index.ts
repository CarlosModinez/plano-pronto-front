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

export interface MaterialsResponse {
  materials: Material[];
  credits: number;
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
  sequence?: Array<{
    time: string;
    activity: string;
    description: string;
  }>;
  created_at: string;
}

export interface AnnualPlanRequest {
  discipline: string;
  serie: string;
  quarter_themes?: string[];
  additional_context?: string;
}

export interface AnnualPlan {
  id: string;
  discipline: string;
  serie: string;
  area_conhecimento?: string;
  conceito_geral?: string;
  objetivo_geral?: string;
  objetivo_especifico?: string[];
  competencias?: string[];
  conhecimentos_habilidades?: string[];
  primeiro_bimestre?: {
    tema?: string;
    etapas?: string[];
    metodologia?: string[];
    recursos?: string[];
    avaliacoes?: string[];
    referencias?: string[];
  };
  segundo_bimestre?: {
    tema?: string;
    etapas?: string[];
    metodologia?: string[];
    recursos?: string[];
    avaliacoes?: string[];
    referencias?: string[];
  };
  terceiro_bimestre?: {
    tema?: string;
    etapas?: string[];
    metodologia?: string[];
    recursos?: string[];
    avaliacoes?: string[];
    referencias?: string[];
  };
  quarto_bimestre?: {
    tema?: string;
    etapas?: string[];
    metodologia?: string[];
    recursos?: string[];
    avaliacoes?: string[];
    referencias?: string[];
  };
  created_at?: string;
}

export interface DidacticSequenceRequest {
  serie: string;
  disciplina: string;
  tema: string;
  objetivo_principal: string;
}

export interface DidacticSequenceActivity {
  numero: number;
  nome: string;
  metodologia: string;
  recursos: string;
  descricao: string;
}

export interface DidacticSequenceDay {
  numero: number;
  titulo: string;
  atividades: DidacticSequenceActivity[];
}

export interface DidacticSequence {
  id: string;
  serie?: string;
  disciplina?: string;
  tema?: string;
  objetivo_principal?: string;
  titulo: string;
  habilidades_bncc: string[];
  dias: DidacticSequenceDay[];
  avaliacao: string;
  consideracoes_finais: string;
  created_at?: string;
}

export interface ActivityGeneratorRequest {
  grade_level: string;
  number_of_students: number;
  environment: string;
}

export interface Activity {
  title: string;
  objective: string;
  materials: string[];
  description: string;
  duration: string;
  step_by_step: string[];
  adaptation: string;
}

export interface ActivityRecord {
  id: string;
  grade_level: string;
  number_of_students: number;
  environment: string;
  activities: Activity[];
  created_at?: string;
}

export interface StudentReportRequest {
  serie: string;
  nivel_dificuldade: string;
  pontos_fortes: string;
  pontos_atencao: string;
  comportamento_social: string;
  necessidades_especificas: string;
  observacoes_professor: string;
}

export interface StudentReport {
  id: string;
  serie: string;
  nivel_dificuldade: string;
  pontos_fortes?: string;
  pontos_atencao?: string;
  comportamento_social?: string;
  necessidades_especificas?: string;
  observacoes_professor?: string;
  introducao?: string;
  desempenho_academico?: string;
  habilidades_sociais?: string;
  comportamento?: string;
  consideracoes_finais?: string;
  created_at?: string;
}

