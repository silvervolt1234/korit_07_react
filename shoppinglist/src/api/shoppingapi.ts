import axios, { AxiosRequestConfig } from 'axios';
import { AccountCredentials, ShoppingItem, ShoppingItemEntry } from '../../type';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error : ', error.response || error.message || error);
    return Promise.reject(error.response?.data || new Error(error.message || '예상 못한 에러 발생'));
  }
);

// JWT 토큰 포함 요청 설정
const getRequestConfig = () : AxiosRequestConfig => {
  const token = sessionStorage.getItem('jwt');
  if(token) {
    return {
      headers: { Authorization: token },  // `Bearer <token>` 형식 저정 토큰 사용
    };
  }
  return {};
}

// 기존 API 관련 함수 정의
export const login = async (creds : AccountCredentials): Promise<string> => {
  try {
    const response = await apiClient.post('/login', creds);
    console.log('=== Response Headers ===', response.headers);  // 여기에 찍어야 함
    const jwtToken = response.headers['authorization'];       // 소문자 key
    // const jwtToken = response.headers.authorization;
    console.log(jwtToken);
    if(!jwtToken) {
      throw new Error('JWT 토큰이 headers에 담겨있지 않습니다')
    }
    return jwtToken;
  } catch (error) {
    console.log('username / password가 틀렸습니다.')
    // error 객체가 AxiosError 인스턴스 유무 확인 과정
    if(axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.response.data?.error || `Login 실패 (${error.response.status})`);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('예측 불가능한 오류가 로그인상에서 발생')
    }
  }
};

export const getItems = async (): Promise<ShoppingItem[]> => {
  const response = await apiClient.get('/api/items', getRequestConfig());
  return response.data;
}

export const addItems = async (item: ShoppingItemEntry): Promise<ShoppingItem> => {
  const response = await apiClient.post('/api/items', item, getRequestConfig());
  return response.data;
}

export const updateItem = async (id: number, itemUpdate: ShoppingItemEntry): Promise<ShoppingItem> => {
  const response = await apiClient.put(`/api/items/$${id}`, itemUpdate, getRequestConfig());
  return response.data;
}

export const deleteItem = async (id: number) : Promise<void> => {
  await apiClient.delete(`/api/items/${id}`, getRequestConfig())
}

// Google ID 토큰 백엔드 전송 및 JWT 수신 관련 함수
/**
 * Google ID 토큰을 백엔드로 보내고 검증 후 앱의 JWT 받아오기
 * @param idToken - Google 로그인 성공시 받은 ID 토큰
 * @returns 백엔드에서 발급한 JWT(Authorization headers 값)
 */
export const authenticateWithGoogleToken = async (idToken : string): Promise<string> => {
  console.log('Google ID 토큰을 백엔드로 전송', idToken.substring(0, 30) + '...')   // 토큰 전체를 노출하지 않기 위해
  try {
    // 백엔드에 구현한 Google 토큰 검증 엔드포인트 호출
    const response = await apiClient.post('/api/auth/google', {idToken});
    const backendJwt = response.data.token;   // 백엔드에서 token field에 JWT를 담아서 반환
    if(!backendJwt) {
      throw new Error('백엔드에서 JWT를 보내지 않았습니다.');
    }
    console.log('JWT가 백엔드로 부터 전송 : ', backendJwt.substring(0, 15) + '...');
    return backendJwt;    // 'Bearer <token>' 형태로 return
  } catch (error) {
    console.log('Backend Google Auth Error : ' + error);
    if(axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.response.data?.error || `백엔드 구글 인증 실패 (${error.response.status})`);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('예측할 수 없는 에러가 구글 인증 시에 발생했습니다.')
    }
  }
}

