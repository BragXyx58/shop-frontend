import { create } from 'zustand';

interface UserState {
  token: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
  setAuth: (token: string, username: string, email: string, role: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
  role: localStorage.getItem('role'),

  setAuth: (token, username, email, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    set({ token, username, email, role });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    set({ token: null, username: null, email: null, role: null });
  }
}));