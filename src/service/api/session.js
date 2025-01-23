import {Alert} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../config';

export const createSession = async () => {
  try {
    const apiRes = await axios.post(`${BASE_URL}/create-session`);
    return apiRes?.data?.sessionId;
  } catch (error) {
    console.log('🚀 ~ createSession ~ error:', error);
    Alert.alert('Error', 'Failed to create session');
    return null;
  }
};

export const checkSession = async sessionId => {
  try {
    const apiRes = await axios.get(
      `${BASE_URL}/is-alive?sessionId=${sessionId}`,
    );
    return apiRes?.data?.isAlive;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    Alert.alert('Error', 'Session expired');
    return null;
  }
};
