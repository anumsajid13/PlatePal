// store.js

import { create } from 'zustand';

const useStore = create((set) => ({
  chefs: [],
  loading: false,
  error: null,
  setChefs: (chefs) => set({ chefs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export { useStore };


