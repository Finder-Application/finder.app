import {API_URL} from '@env';
import axios from 'axios';

export const client = axios.create({
  baseURL: API_URL,
});
