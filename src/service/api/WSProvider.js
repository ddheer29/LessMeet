import React, {createContext, useContext, useEffect, useRef} from 'react';
import {SOCKET_URL} from '../config';
import {io} from 'socket.io-client';

const WSContext = createContext();

export const WSProvider = ({children}) => {
  const socket = useRef();
  useEffect(() => {
    socket.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    return () => socket.current?.disconnect();
  }, []);

  // message send krna
  const emit = (event, data) => {
    socket.current?.emit(event, data);
  };

  // message listen krna
  const on = (event, cb) => {
    socket.current?.on(event, cb);
  };

  // mai ab message na sununga na send krunga pura connection band krunga
  const off = (event, cb) => {
    socket.current?.off(event, cb);
  };

  // message sunna band krna
  const removeListener = listenerName => {
    socket.current?.removeListener(listenerName);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current?.disconnect();
      socket.current = undefined;
    }
  };

  const socketSevice = {
    initializeSocket: () => {},
    emit,
    on,
    off,
    removeListener,
    disconnect,
  };

  return (
    <WSContext.Provider value={socketSevice}>{children}</WSContext.Provider>
  );
};

export const useWS = () => {
  const socketSevice = useContext(WSContext);
  if (!socketSevice) {
    throw new Error('useWS must be used within a WSProvider');
  }
  return socketSevice;
};
