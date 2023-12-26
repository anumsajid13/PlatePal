// AllUsersStore.js
import { create } from 'zustand';

const useAllUsersStore = create((set) => ({
  registeredVendors: [],
  registeredNutritionists: [],
  registeredChefs: [],
  setRegisteredVendors: (registeredVendors) => set({ registeredVendors }),
  setRegisteredNutritionists: (registeredNutritionists) => set({ registeredNutritionists }),
  setRegisteredChefs: (registeredChefs) => set({ registeredChefs }),
}));

export default useAllUsersStore;
