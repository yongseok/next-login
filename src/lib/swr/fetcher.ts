import { UserUpdateDto } from '../validations/userUpdateSchema';

export const updateUser = async (url: string, data: UserUpdateDto) => {
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};
