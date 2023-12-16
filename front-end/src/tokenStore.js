// tokenStore.js
import create from 'zustand';

const useTokenStore = create((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
}));

export default useTokenStore;
