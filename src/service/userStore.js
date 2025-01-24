import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';
import {user} from '../utils/dummyData';

export const useUserStore = create()(
  persist(
    (set, get) => ({
      user: null,
      sessions: [],
      setUser: user => set({user}),
      addSession: sessionId => {
        const {sessions} = get();
        const existingSessionIndex = sessions.findIndex(s => s === sessionId);
        if (existingSessionIndex === -1) {
          set({sessions: [sessionId, ...sessions]});
        }
      },
      removeSession: sessionId => {
        const {sessions} = get();
        const updatedSessions = sessions.filter(s => s !== sessionId);
        set({
          sessions: updatedSessions,
        });
      },
      clear: () =>
        set({
          user: null,
          sessions: [],
        }),
    }),
    {
      name: 'user-storage',
      getStorage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
