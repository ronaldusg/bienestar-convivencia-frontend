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
  // async getAll(filters?: {
  //   interests?: string;
  //   nationality?: string;
  //   faculty?: string;
  // }): Promise<User[]> {
  //   const params = new URLSearchParams();
  //   if (filters?.interests) params.append('interests', filters.interests);
  //   if (filters?.nationality) params.append('nationality', filters.nationality);
  //   if (filters?.faculty) params.append('faculty', filters.faculty);

  //   // const response = await api.get<any, UsersResponse>(`/users?${params.toString()}`);
  //   // //return response.data.users;
  //   // return (response.data as any)?.users || (response.data as any) || [];
  //   const res = await api.get(`/users?${params.toString()}`);

  //   const users =
  //     (res as any)?.users ??
  //     (res as any)?.data?.users ??
  //     (res as any)?.data ??
  //     res;

  //   // return (res as any)?.users ?? (res as any) ?? [];
  //   return Array.isArray(users) ? users : [];
  // },
  async getAll(filters?: {
    interests?: string;
    nationality?: string;
    faculty?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.interests) params.append('interests', filters.interests);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.faculty) params.append('faculty', filters.faculty);

    const res = await api.get(`/users?${params.toString()}`);

    const users =
      (res as any)?.users ??
      (res as any)?.data?.users ??
      (res as any)?.data ??
      res;

    return (Array.isArray(users) ? users : []).map((u: any) => ({
      ...u,
      id: u.id ?? u._id, // 🔹 Normaliza id
      interests: Array.isArray(u?.interests) ? u.interests : [], // 🔹 Evita errores de .map()
    }));
  },

  // async getById(id: string): Promise<User> {
  //   const response = await api.get<any, UserResponse>(`/users/${id}`);
  //   return response.data.user;
  // },

  // async getById(id: string): Promise<User> {
  //   const res = await api.get(`/users/${id}`);
  //   // si el backend envía { data: { user } } o { user } o el user directo:
  //   return (res as any)?.user ?? (res as any)?.data?.user ?? (res as any);
  // },

  async getById(id: string): Promise<User> {
    const res = await api.get(`/users/${id}`);
    const user = (res as any)?.user ?? (res as any)?.data?.user ?? (res as any);
    if (!user) throw new Error('Usuario no encontrado');

    return {
      ...user,
      id: user.id ?? user._id, // 🔹 Normaliza id
      interests: Array.isArray(user?.interests) ? user.interests : [], // 🔹 Previene error al renderizar intereses
    };
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<any, UserResponse>(`/users/${id}`, data);
    return response.data.user;
  },

  async create(payload: {
    name: string;
    email: string;
    password: string;              // req. por el backend
    role?: 'student' | 'admin';
    faculty?: string;
    nationality?: string;
    interests?: string[];
  }) {
    // El backend crea usuarios por /auth/register
    const res = await api.post('/auth/register', payload);

    // Normaliza varias formas de respuesta
    const raw =
      (res as any)?.data?.user ??
      (res as any)?.user ??
      (res as any)?.data?.data?.user ??
      (res as any)?.data ??
      res;

    return (raw?.user ?? raw) as any;
  },

  async remove(id: string) {
    const res = await api.delete(`/users/${id}`);
    return (res as any)?.data?.message ?? (res as any)?.message ?? 'OK';
  },
};
