import axios from 'axios';
import i18n from '../i18n';
import { useUserStore } from '../store/userStore';

export const apiAuth = axios.create({ baseURL: 'http://localhost:5001/api' });
export const apiProducts = axios.create({ baseURL: 'http://localhost:5002/api' });
export const apiOrders = axios.create({ baseURL: 'http://localhost:5003/api' });
export const apiUsers = axios.create({ baseURL: 'http://localhost:5004/api' });

const authInterceptor = (config: any) => {
  config.headers['Accept-Language'] = i18n.language.substring(0, 2);
  
  const token = useUserStore.getState().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

apiAuth.interceptors.request.use(authInterceptor);
apiProducts.interceptors.request.use(authInterceptor);
apiOrders.interceptors.request.use(authInterceptor);
apiUsers.interceptors.request.use(authInterceptor);