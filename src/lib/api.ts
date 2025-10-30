import axios from 'axios';

const BASE_URL = 'https://finz-site.shop';
const ALWAYS_TOKEN = 'icansleep';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 기본값으로 항상 주입
    accessToken: ALWAYS_TOKEN,
  },
});

// 📍요청 로깅 인터셉터
api.interceptors.request.use(config => {
  console.log(
    '📤 [API REQUEST]',
    JSON.stringify(
      {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      },
      null,
      2,
    ),
  );
  return config;
});

// 응답 로깅 인터셉터 (성공/실패 공통)
api.interceptors.response.use(
  res => {
    console.log(
      '✅ [API RESPONSE]',
      JSON.stringify(
        {
          url: res.config.url,
          status: res.status,
          data: res.data,
        },
        null,
        2,
      ),
    );
    return res;
  },
  error => {
    console.log(
      '❌ [API ERROR]',
      JSON.stringify(
        {
          url: error?.config?.url,
          status: error?.response?.status,
          message: error?.message,
          response: error?.response?.data,
        },
        null,
        2,
      ),
    );
    return Promise.reject(error);
  },
);
