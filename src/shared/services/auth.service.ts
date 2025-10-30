import api from '../api';
import { User } from '../types/auth.types';

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post<any, AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post<any, AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<any, MeResponse>('/auth/me');
    return response.data.user;
  },
};
