// blockUserstore.js
import { create } from 'zustand';

const useChefStore = create((set) => ({
  blockedChefs: [],
  blockedVendors: [],
  blockedNutritionists: [],
  setBlockedChefs: (blockedChefs) => set({ blockedChefs }),
  setBlockedVendors: (blockedVendors) => set({ blockedVendors }),
  setBlockedNutritionists: (blockedNutritionists) => set({ blockedNutritionists }),
}));

export default useChefStore;
