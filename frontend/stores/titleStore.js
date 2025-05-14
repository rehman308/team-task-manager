import { create } from 'zustand';

const useTitleStore = create((set) => ({
  title: '',
  setPassTitle: (newTitle) => set({ title: newTitle }),
}));

export default useTitleStore;
