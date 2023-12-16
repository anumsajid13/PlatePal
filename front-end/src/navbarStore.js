import create from 'zustand';

const useNavbarStore = create((set) => ({
  showDropdown: false,
  activeLink: 'Home',
  searchInput: '',
  toggleDropdown: () => set((state) => ({ showDropdown: !state.showDropdown })),
  setActiveLink: (link) => set(() => ({ activeLink: link })),
  setSearchInput: (input) => set(() => ({ searchInput: input })),
}));

export default useNavbarStore;