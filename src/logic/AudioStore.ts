import { create } from 'zustand';

export const useAudioStore = create((set) => ({
  intensity: 0,
  setIntensity: (val) => set({ intensity: val }),
}));
