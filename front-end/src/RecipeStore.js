
// RecipeStore.js
import {create} from 'zustand';

const useRecipeStore = create((set) => ({
  isNewRecipe: false,
  setNewRecipe: (value) => set({ isNewRecipe: value }),
}));

export default useRecipeStore;
