import { api } from '@/lib/api';

export interface AcademyContent {
  lectureSlides?: string[];
  lecture?: string | string[];
  explore?: string | string[];
  apply?: string[];
  journalPrompt?: string;
  resources?: string[];
  slides?: string[];
}

export interface AcademyModule {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  trackId?: string;
  journey?: string;
  slug?: string;
  registryFocus?: string;
  estimatedMinutes?: number;
  accentColor?: string;
  placeholder?: boolean;
  track?: string;
  order?: number;
  content: AcademyContent;
}

export interface JourneyGroup {
  id: string;
  title: string;
  modules: AcademyModule[];
}

export type AcademyModuleCard = {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  journey?: string;
  stage?: string;
  slug?: string;
  completed?: boolean;
  progress?: number;
};

export interface AcademyModulesResponse {
  modules: AcademyModuleCard[];
}

export async function fetchModulesServerSide(options?: {
  cookie?: string;
  baseUrl?: string;
}): Promise<AcademyModulesResponse> {
  const baseUrl =
    options?.baseUrl ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const url = new URL("/api/academy/modules", baseUrl);
  const headers: Record<string, string> = {};

  if (options?.cookie) {
    headers.cookie = options.cookie;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch academy modules");
  }

  return response.json();
}

export type AcademyModuleDetail = {
  id: string;
  title: string;
  journey?: string;
  description?: string;
  objectives?: string[];
  sections?: { title: string; content: string }[];
  lecture?: string;
  estimatedMinutes?: number;
  slug?: string;
  stage?: string;
  completed?: boolean;
  progress?: number;
};

export async function fetchModuleServerSide(options: {
  moduleId: string;
  cookie?: string;
  baseUrl?: string;
}): Promise<{ module: AcademyModuleDetail | null }> {
  const baseUrl =
    options.baseUrl ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const url = new URL(`/api/academy/modules/${options.moduleId}`, baseUrl);
  const headers: Record<string, string> = {};

  if (options.cookie) {
    headers.cookie = options.cookie;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { module: null };
    }
    throw new Error("Unable to fetch module");
  }

  return response.json();
}

export const academyClient = {
  async listModules(): Promise<AcademyModule[]> {
    const res = await api.get('/academy/modules');
    return res.data?.modules ?? [];
  },

  async getModule(moduleId: string): Promise<AcademyModule | null> {
    try {
      const res = await api.get(`/academy/module/${moduleId}`);
      return res.data?.module ?? null;
    } catch {
      return null;
    }
  },

  async getRecommended(): Promise<string | null> {
    try {
      const res = await api.get('/academy/recommended');
      return res.data?.title ?? null;
    } catch {
      return null;
    }
  },
};
