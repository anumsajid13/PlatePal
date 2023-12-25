// TopStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
  topChefs: [],
  topNutritionists: [],
  topVendors: [],
  fetchTopChefs: (data) => set({ topChefs: data }),
  fetchTopNutritionists: (data) => set({ topNutritionists: data }),
  fetchTopVendors: (data) => set({ topVendors: data }),
}));

export { useStore };
