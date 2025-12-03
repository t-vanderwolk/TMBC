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

export const academyClient = {
  async listModules(): Promise<AcademyModule[]> {
    const res = await api.get('/api/academy/modules');
    return res.data?.modules ?? [];
  },

  async getModule(moduleId: string): Promise<AcademyModule | null> {
    try {
      const res = await api.get(`/api/academy/module/${moduleId}`);
      return res.data?.module ?? null;
    } catch {
      return null;
    }
  },

  async getRecommended(): Promise<string | null> {
    try {
      const res = await api.get('/api/academy/recommended');
      return res.data?.title ?? null;
    } catch {
      return null;
    }
  },
};
