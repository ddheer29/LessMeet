import {Platform} from 'react-native';

export const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const SOCKET_URL =
  Platform.OS === 'android' ? 'ws://10.0.2.2:3000' : 'ws://localhost:3000';

// deployed url
// export const BASE_URL = 'https://localhost:3000';
// export const SOCKET_URL = 'wss://localhost:3000';
