// store.js

import { create } from 'zustand';

const useStore = create((set) => ({
  chefs: [],
  nutri:[],
  vendor:[],
  loading: false,
  error: null,
  setChefs: (chefs) => set({ chefs }),
  setNutri: (nutri) => set({ nutri }),
  setVendor: (vendor) => set({ vendor }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export { useStore };


