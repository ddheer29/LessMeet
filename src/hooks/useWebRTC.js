import {useEffect, useRef, useState} from 'react';
import {useLiveMeetStore} from '../service/meetStore';
import {useUserStore} from '../service/userStore';
import {useWS} from '../service/api/WSProvider';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {peerConstraints} from '../utils/Helpers';

export const useWebRTC = () => {
  const {
    participants,
    setStreamUrl,
    addSessionId,
    addParticipant,
    micOn,
    videoOn,
    toggle,
    sessionId,
    removeSessionId,
    removeParticipant,
    updateParticipant,
  } = useLiveMeetStore();
  const {user} = useUserStore();
  const [localStream, setLocalStream] = useState(null);
  const {emit, on, off} = useWS();
  const peerConnections = useRef(new Map());
  const pendingCandidates = useRef(new Map());

  const startLocalStream = async () => {
    try {
      const mediaSteam = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(mediaSteam);
    } catch (error) {
      console.log('Error starting local stream', error);
    }
  };

  const establishPeerConnections = async () => {
    participants?.forEach(async streamUser => {
      if (!peerConnections.current.has(streamUser?.userId)) {
        const peerConection = new RTCPeerConnection(peerConstraints);
        peerConnections.current.set(streamUser?.userId, peerConection);

        // onTrack is a event listern, ye ek baar subscribe hota hai esme agr updates aate hai toh humko bateyga
        peerConection.onTrack = event => {
          const remoteStream = new MediaStream();
          event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
          });
          console.log('RECEVING REMOTE STREAM', remoteStream.toURL());
          setStreamUrl(streamUser?.userId, remoteStream);
        };

        peerConection.onicecandidate = ({candidate}) => {
          if (candidate) {
            emit('send-ice-candidate', {
              sessionId,
              sender: user?.id,
              receiver: streamUser?.userId,
              candidate,
            });
          }
        };

        localStream?.getTracks().forEach(track => {
          peerConection.addTrack(track, localStream);
        });

        try {
          const offerDescription = await peerConection.createOffer();
          await peerConection.setLocalDescription(offerDescription);
          emit('send-offer', {
            sessionId,
            sender: user?.id,
            receiver: streamUser?.userId,
            offer: offerDescription,
          });
        } catch (error) {
          console.log('Error creating offer', error);
        }
      }
    });
  };

  const joiningStream = async () => {
    await establishPeerConnections();
  };

  useEffect(() => {
    if (localStream) {
      joiningStream();
    }
  }, [localStream]);

  useEffect(() => {
    startLocalStream();
    if (localStream) {
      return () => {
        localStream?.getTracks().forEach(track => track.stop());
      };
    }
  }, []);

  const handleReceiveIceCandidate = async ({sender, receiver, candidate}) => {
    if (receiver !== user?.id) return;
    const peerConection = peerConnections.current.get(sender);
    if (peerConection) {
      peerConection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      if (!pendingCandidates.current.has(sender)) {
        pendingCandidates?.current?.set(sender, []);
      }
      pendingCandidates.current.get(sender).push(candidate);
    }
  };

  const handleReceiveOffer = async ({sender, receiver, offer}) => {
    if (receiver !== user?.id) return;
    try {
      let peerConection = peerConnections.current.get(sender);
      if (!peerConection) {
        peerConection = new RTCPeerConnection(peerConstraints);
        peerConnections.current.set(sender, peerConection);
        // ontract ka use krke event lister add krenge taki humko sedner ka remote stream mil ske (remote stream means audio video ka url)
        peerConection.onTrack = event => {
          const remoteStream = new MediaStream();
          event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
            console.log('RECEIVING REMOTE STREAM', remoteStream.toURL());
          });
          setStreamUrl(sender, remoteStream);
        };
        peerConection.onicecandidate = ({candidate}) => {
          if (candidate) {
            emit('send-ice-candidate', {
              sessionId,
              sender: receiver,
              receiver: sender,
              candidate,
            });
          }
        };
        if (pendingCandidates.current.has(sender)) {
          pendingCandidates.current
            .get(sender)
            .forEach(candidate =>
              peerConection.addIceCandidate(new RTCIceCandidate(candidate)),
            );
          pendingCandidates.current.delete(sender);
        }
        if (localStream) {
          localStream
            .getTracks()
            .forEach(track => peerConection.addTrack(track, localStream));
        }
      }
      await peerConection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConection.createAnswer();
      await peerConection.setLocalDescription(answer);
      emit('send-answer', {
        sessionId,
        sender: receiver,
        receiver: sender,
        answer,
      });
    } catch (error) {
      console.log('Error receiving offer', error);
    }
  };

  const handleReceiveAnswer = async ({sender, receiver, answer}) => {
    if (receiver !== user?.id) return;
    const peerConection = peerConnections.current.get(sender);
    if (peerConection) {
      await peerConection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    }
  };

  const handleNewParticipant = participant => {
    if (participant?.userId === user?.id) return;
    addParticipant(participant);
  };

  const handleParticipantLeft = userId => {
    removeParticipant(userId);
    const pc = peerConnections.current.get(userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(userId);
    }
  };

  const handleParticipantUpdate = updatedParticipant => {
    updateParticipant(updatedParticipant);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        micOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
    toggle('mic');
    emit('toggle-mute', {sessionId, userId: user?.id});
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        videoOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
    toggle('video');
    emit('toggle-video', {sessionId, userId: user?.id});
  };

  const switchCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track._switchCamera();
      });
    }
  };

  useEffect(() => {
    if (localStream) {
      on('receive-ice-candidate', handleReceiveIceCandidate);
      on('receive-offer', handleReceiveOffer);
      on('receive-answer', handleReceiveAnswer);
      on('new-participant', handleNewParticipant);
      on('participant-left', handleParticipantLeft);
      on('participant-update', handleParticipantUpdate);

      return () => {
        localStream?.getTracks().forEach(track => track.stop());
        peerConnections.current.forEach(pc => pc.close());
        peerConnections.current.clear();
        addSessionId(null);
        clear();
        emit('hang-up');
        off('receive-ice-candidate');
        off('receive-offer');
        off('receive-answer');
        off('new-participant');
        off('participant-left');
        off('participant-update');
      };
    }
  }, [localStream]);

  return {
    localStream,
    participants,
    toggleMic,
    toggleVideo,
    switchCamera,
  };
};
