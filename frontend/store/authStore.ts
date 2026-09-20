import { create } from 'zustand';
import { IUser } from '../types/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('osmium_token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('osmium_token', token);
      }

      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user, token } = data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('osmium_token', token);
      }

      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('osmium_token');
    }
    set({ user: null, token: null, error: null });
  },

  fetchProfile: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ user: data.data.user, isLoading: false });
      } else {
        get().logout();
      }
    } catch (err) {
      get().logout();
    }
  },
}));
