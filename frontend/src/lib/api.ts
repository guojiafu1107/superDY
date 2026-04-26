import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data;
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data.data;
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data.data;
}

// Auth API
export const authApi = {
  douyinAuth: () => window.location.href = `${API_BASE_URL}/auth/douyin`,
  getCurrentUser: () => get<User>('/users/me'),
  refreshToken: () => post<{ token: string }>('/auth/refresh'),
};

// Trend API
export const trendApi = {
  getHotTrends: (category?: string, limit = 20, offset = 0) => 
    get<TrendItem[]>(`/trends/hot?${category ? `category=${category}&` : ''}limit=${limit}&offset=${offset}`),
  getSubscribedTrends: () => get<TrendItem[]>('/trends/subscribed'),
  analyzeVideo: (shareUrl: string) => post<{ taskId: string }>('/trends/analyze', { shareUrl }),
  getAnalysisResult: (taskId: string) => get<VideoAnalysis | null>(`/trends/analyze/${taskId}`),
};

// Inspiration API
export const inspirationApi = {
  getInspirations: (params?: { category?: string; tags?: string[] }) => 
    get<PaginatedData<Inspiration>>('/inspirations', { params }),
  createInspiration: (data: Partial<Inspiration>) => post<Inspiration>('/inspirations', data),
  updateInspiration: (id: string, data: Partial<Inspiration>) => put<Inspiration>(`/inspirations/${id}`, data),
  deleteInspiration: (id: string) => del<void>(`/inspirations/${id}`),
  searchInspirations: (q: string, dateRange?: [string, string]) => 
    get<Inspiration[]>('/inspirations/search', { params: { q, dateRange } }),
};

// Style API
export const styleApi = {
  analyzeStyle: () => post<{ taskId: string }>('/style/analyze'),
  getStyleProfile: () => get<StyleProfile>('/style/profile'),
};

// Script API
export const scriptApi = {
  generateScript: (data: { topic: string; duration: number; tone: string; targetAudience?: string; useWebSearch?: boolean }) => 
    post<{ scriptId: string; taskId: string }>('/scripts/generate', data),
  getScript: (scriptId: string) => get<Script>(`/scripts/${scriptId}`),
  generateVariants: (scriptId: string) => post<{ taskId: string }>(`/scripts/${scriptId}/variants`),
  generateTitles: (scriptId: string) => post<{ titles: TitleSuggestion[] }>(`/scripts/${scriptId}/titles`),
  exportScript: (scriptId: string, format: 'json' | 'pdf') => 
    get<Blob>(`/scripts/${scriptId}/export?format=${format}`, { responseType: 'blob' }),
};

// Publish API
export const publishApi = {
  getCalendar: (month: string) => get<PublishTask[]>(`/publish/calendar?month=${month}`),
  createTask: (data: Partial<PublishTask>) => post<PublishTask>('/publish/tasks', data),
  getBestTime: () => get<{ slots: string[] }>('/publish/best-time'),
  getLiveStats: (taskId: string) => get<VideoAnalytics>(`/publish/${taskId}/live-stats`),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => get<DashboardOverview>('/analytics/dashboard'),
  getAudience: () => get<AudienceProfile>('/analytics/audience'),
  getVideoAnalytics: (videoId: string) => get<VideoAnalytics>(`/analytics/videos/${videoId}`),
};

// Import types for API functions
import { User, TrendItem, VideoAnalysis, Inspiration, StyleProfile, Script, TitleSuggestion, PublishTask, VideoAnalytics, DashboardOverview, AudienceProfile } from '@/types';
