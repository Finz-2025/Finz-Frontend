import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰/공통 헤더 주입
export function setAccessToken(token?: string) {
  if (token) api.defaults.headers.common.accessToken = token;
  else delete api.defaults.headers.common.accessToken;
}
