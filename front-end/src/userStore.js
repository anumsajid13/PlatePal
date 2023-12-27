// userStore.js
import {create} from 'zustand';

const useUserStore = create((set) => ({
  nut: false,
  setNut: (value) => set({ nut: value }),
}));

export default useUserStore;
