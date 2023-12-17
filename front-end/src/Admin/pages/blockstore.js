// blockstore.js

import {create} from 'zustand';

export const useBlockStore = create((set) => ({
  blockReports: [],
  setBlockReports: (reports) => set({ blockReports: reports }),
}));

export default useBlockStore;
