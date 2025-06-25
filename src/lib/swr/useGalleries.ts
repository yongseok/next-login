import useSWR from 'swr';
import { API_ENDPOINTS } from '../config/api';
import { getGalleryById } from './fetcher';

export const useGetGalleryById = (id: string) => {
  const { data, error, isLoading } = useSWR(API_ENDPOINTS.GALLERY.GET(id), getGalleryById, {
    revalidateOnFocus: true, // 포커스 시 재검증
    revalidateOnReconnect: true, // 재연결 시 재검증
    revalidateIfStale: true, // 데이터가 오래되었을 때 재검증
  });
  return { data, error, isLoading };
};