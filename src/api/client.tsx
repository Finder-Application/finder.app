import {API_URL} from '@env';
import axios, {AxiosRequestHeaders, InternalAxiosRequestConfig} from 'axios';
import {getToken} from 'core/Auth/utils';

export const client = axios.create({
  baseURL: API_URL,
});

export const privateClient = axios.create({
  baseURL: API_URL,
});

privateClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const {data} = config;
    const token = getToken()?.access;
    const contentType =
      data instanceof FormData ? 'multipart/form-data' : 'application/json';

    const defaultHeaders = {
      'content-type': contentType,
      authorization: `Bearer ${token}`,
    };

    return {
      ...config,
      headers: {
        ...config.headers,
        ...defaultHeaders,
      } as unknown as AxiosRequestHeaders,
    };
  },
);
