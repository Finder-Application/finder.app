import {API_URL} from '@env';
import axios from 'axios';
import {getToken} from 'core/Auth/utils';

export const client = axios.create({
  baseURL: API_URL,
});

export const privateClient = axios.create({
  baseURL: API_URL,
  headers: {Authorization: `Bearer ${getToken()?.access}`},
});
