export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

export const CLIENT_ROUTES = {
  AUTH: {
    LOGIN: `${PUBLIC_URL}/login`,
    REGISTER: `${PUBLIC_URL}/register`,
  },
  GALLERY: {
    DETAIL: (id: string) => `${PUBLIC_URL}/gallery/${id}`,
    EDIT: (id: string) => `${PUBLIC_URL}/gallery/${id}/edit`,
  },
};
