import { apiRequest } from './client'
import type { User } from '../types/user/models'

export interface RegisterPayload {
  username: string
  email: string
  password: string
  imageName?: string
}

export interface LoginPayload {
  emailOrUsername: string
  password: string
}

export interface UpdateProfilePayload {
  username?: string
  imageName?: string
  equippedTitle?: string
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<User>('/auth/register', { method: 'POST', body: payload }),

  login: (payload: LoginPayload) =>
    apiRequest<User>('/auth/login', { method: 'POST', body: payload }),

  logout: () =>
    apiRequest<void>('/auth/logout', { method: 'POST', skipAuthRefresh: true }),

  me: () =>
    apiRequest<User>('/users/me'),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiRequest<User>('/users/me', { method: 'PATCH', body: payload }),
}