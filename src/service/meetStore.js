import {create} from 'zustand';
import {createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useLiveMeetStore = create()(
  (set, get) => ({
    sessionId: null,
    participants: [],
    chatMessages: [],
    micOn: false,
    videoOn: false,
    addSessionId: id => {
      set({sessionId: id});
    },
    removeSessionId: id => {
      set({sessionId: null});
    },
  }),
  {
    name: 'live-meet-storage',
    getStorage: createJSONStorage(() => mmkvStorage),
  },
);
