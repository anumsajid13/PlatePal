// tokenStore.js
import { create } from 'zustand';
const useTokenStore = create((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
  logout: () => set({ token: null }),
}));
export default useTokenStore;

