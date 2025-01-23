import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useUserStore = create()(
  persist((set, get) => ({}), {
    name: 'user-storage',
    getStorage: createJSONStorage(() => mmkvStorage),
  }),
);
