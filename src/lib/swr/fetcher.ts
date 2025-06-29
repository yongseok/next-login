import axios from 'axios';
import { UserUpdateDto } from '../validations/userUpdateSchema';
import { FileData } from '@/types/gallery';

export const updateUser = async (url: string, data: UserUpdateDto) => {
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getUserByEmail = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export const uploadFileWithPreview = async (
  url: string,
  data: FileData,
  signal: AbortSignal | undefined,
  onUploadProgress: (progress: number) => void
) => {
  if (data.type !== 'local') {
    throw new Error('File type is not local');
  }
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('id', data.id);
  formData.append('type', data.type);
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      onUploadProgress(progress);
    },
    signal,
  });
  return response.data;
};

export const getGalleryById = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};