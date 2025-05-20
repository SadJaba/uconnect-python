import { api } from '../config';
import type { User } from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login/', { username, password }),

  register: (username: string, email: string, password: string) =>
    api.post('/auth/register/', { username, email, password }),

  getCurrentUser: () =>
    api.get<User>('/auth/user/'),

  updateProfile: (username: string, email: string) =>
    api.patch<User>('/auth/user/', { username, email }),

  changePassword: (current_password: string, new_password: string) =>
    api.post('/auth/change-password/', { current_password, new_password }),
}; 