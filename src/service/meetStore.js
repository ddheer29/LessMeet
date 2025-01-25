import {create} from 'zustand';
import {createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useLiveMeetStore = create()(
  (set, get) => ({
    sessionId: null,
    participants: [],
    // chatMessages: [],
    micOn: false,
    videoOn: false,
    addSessionId: id => {
      set({sessionId: id});
    },
    removeSessionId: () => {
      set({sessionId: null});
    },
    addParticipant: participant => {
      const {participants} = get();
      if (!participants.find(p => p.userId === participant?.userId)) {
        set({participants: [participant, ...participants]});
      }
    },
    removeParticipant: participantId => {
      const {participants} = get();
      const updatedParticipants = participants.filter(
        p => p.userId !== participantId,
      );
      set({participants: updatedParticipants});
    },
    updatedParticipants: updatedParticipants => {
      const {participants} = get();
      set({
        participants: participants.map(p =>
          p.userId === updatedParticipants.userId
            ? {
                ...p,
                micOn: updatedParticipants.micOn,
                videoOn: updatedParticipants.videoOn,
              }
            : p,
        ),
      });
    },
    setStreamUrl: (participantId, streamURL) => {
      const {participants} = get();
      const updatedParticipants = participants.map(p =>
        p.userId === participantId ? {...p, streamURL} : p,
      );
      set({participants: updatedParticipants});
    },
    toggle: type => {
      if (type === 'mic') {
        set(state => ({micOn: !state.micOn}));
      } else if (type === 'video') {
        set(state => ({videoOn: !state.videoOn}));
      }
    },
  }),
  {
    name: 'live-meet-storage',
    getStorage: createJSONStorage(() => mmkvStorage),
  },
);
