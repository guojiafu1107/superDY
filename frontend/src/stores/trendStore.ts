import { create } from 'zustand';
import { TrendItem, Inspiration, VideoAnalysis } from '@/types';

interface TrendState {
  hotTrends: TrendItem[];
  subscribedTrends: TrendItem[];
  inspirations: Inspiration[];
  currentAnalysis: VideoAnalysis | null;
  selectedCategory: string;
  isLoading: boolean;
  setHotTrends: (trends: TrendItem[]) => void;
  setSubscribedTrends: (trends: TrendItem[]) => void;
  setInspirations: (inspirations: Inspiration[]) => void;
  addInspiration: (inspiration: Inspiration) => void;
  removeInspiration: (id: string) => void;
  setCurrentAnalysis: (analysis: VideoAnalysis | null) => void;
  setSelectedCategory: (category: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useTrendStore = create<TrendState>((set) => ({
  hotTrends: [],
  subscribedTrends: [],
  inspirations: [],
  currentAnalysis: null,
  selectedCategory: 'all',
  isLoading: false,
  setHotTrends: (trends) => set({ hotTrends: trends }),
  setSubscribedTrends: (trends) => set({ subscribedTrends: trends }),
  setInspirations: (inspirations) => set({ inspirations }),
  addInspiration: (inspiration) => 
    set((state) => ({ inspirations: [inspiration, ...state.inspirations] })),
  removeInspiration: (id) =>
    set((state) => ({ inspirations: state.inspirations.filter((i) => i.id !== id) })),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
