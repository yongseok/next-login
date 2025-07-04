export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  USERS: {
    GET: (id: string) => `${API_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_URL}/users/${id}`,
  },
  FILES: {
    UPLOAD: `${API_URL}/files/upload`,
  },
  GALLERY: {
    UPLOAD: `${API_URL}/gallery/upload`,
    GET_ALL: (page: number, limit: number) =>
      `${API_URL}/galleries?page=${page}&limit=${limit}`,
    GET: (id: string) => `${API_URL}/galleries/${id}`,
    UPDATE: (id: string) => `${API_URL}/gallery/${id}`,
    DELETE: (id: string) => `${API_URL}/gallery/${id}`,
  },
};
