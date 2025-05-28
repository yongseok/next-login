export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  USERS: {
    GET: (id: string) => `${API_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_URL}/users/${id}`,
  },
};
