import { create } from 'zustand';
import { Script, StyleProfile, TitleSuggestion } from '@/types';

interface ScriptState {
  scripts: Script[];
  currentScript: Script | null;
  styleProfile: StyleProfile | null;
  isGenerating: boolean;
  generationProgress: number;
  setScripts: (scripts: Script[]) => void;
  addScript: (script: Script) => void;
  updateScript: (script: Script) => void;
  setCurrentScript: (script: Script | null) => void;
  setStyleProfile: (profile: StyleProfile | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
}

export const useScriptStore = create<ScriptState>((set) => ({
  scripts: [],
  currentScript: null,
  styleProfile: null,
  isGenerating: false,
  generationProgress: 0,
  setScripts: (scripts) => set({ scripts }),
  addScript: (script) =>
    set((state) => ({ scripts: [script, ...state.scripts] })),
  updateScript: (script) =>
    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === script.id ? script : s)),
      currentScript: state.currentScript?.id === script.id ? script : state.currentScript,
    })),
  setCurrentScript: (script) => set({ currentScript: script }),
  setStyleProfile: (profile) => set({ styleProfile: profile }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
}));
