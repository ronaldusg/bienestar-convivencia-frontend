import api from '../api';
import { User } from '../types/auth.types';

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
  };
}

interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export const usersService = {
  async getAll(filters?: {
    interests?: string;
    nationality?: string;
    faculty?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.interests) params.append('interests', filters.interests);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.faculty) params.append('faculty', filters.faculty);

    const response = await api.get<any, UsersResponse>(`/users?${params.toString()}`);
    return response.data.users;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<any, UserResponse>(`/users/${id}`);
    return response.data.user;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<any, UserResponse>(`/users/${id}`, data);
    return response.data.user;
  },
};
