const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = {
  async get(url: string, token?: string) {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.json();
  },

  async post(url: string, data: any, token?: string) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async patch(url: string, data: any, token?: string) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
