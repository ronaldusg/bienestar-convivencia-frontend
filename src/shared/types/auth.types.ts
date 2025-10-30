export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  faculty?: string;
  career?: string;
  interests?: string[];
  avatar?: string;
  nationality?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
