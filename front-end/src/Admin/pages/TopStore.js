import {create} from 'zustand';

const useStore = create((set) => ({
  topChefs: [],
  topNutritionists: [],
  fetchTopChefs: async () => {
    try {
      const response = await fetch('http://localhost:9000/admin/top-chefs');
      const data = await response.json();
      set({ topChefs: data.topChefs });
    } catch (error) {
      console.error('Error fetching top chefs:', error);
    }
  },
//   fetchTopNutritionists: async () => {
//     try {
//       const response = await fetch('/api/top-nutritionists');
//       const data = await response.json();
//       set({ topNutritionists: data.topNutritionists });
//     } catch (error) {
//       console.error('Error fetching top nutritionists:', error);
//     }
//   },
}));

export { useStore };
