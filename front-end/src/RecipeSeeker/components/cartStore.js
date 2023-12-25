import create from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
  clearCart: () => set({ cartItems: [] }),
  isCartPopupOpen: false,
  toggleCartPopup: () => {
    console.log('Toggling cart popup');
    set((state) => ({ isCartPopupOpen: !state.isCartPopupOpen }));
  },
  
}));

export default useCartStore;