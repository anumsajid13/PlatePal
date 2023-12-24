// ChefStore.js
import {create} from 'zustand';

const useChefStore = create((set) => ({
  registeredChefs: [],
  blockedChefs: [],
  setRegisteredChefs: (registeredChefs) => set( {registeredChefs }),
  setBlockedChefs: (blockedChefs) => set({ blockedChefs} ),
}));

export default useChefStore;
