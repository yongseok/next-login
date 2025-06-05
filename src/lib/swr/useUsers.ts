import { useSession } from 'next-auth/react';
import { API_ENDPOINTS } from '../config/api';
import { getUserByEmail, updateUser } from './fetcher';
import useSWRMutation from 'swr/mutation';
import { UserUpdateDto } from '../validations/userUpdateSchema';
import useSWR from 'swr';

export const useUpdateUser = (email: string) => {
  const encodedEmail = encodeURIComponent(email);
  const { data: session, update: sessionUpdate } = useSession();
  const { trigger, isMutating, error } = useSWRMutation(
    API_ENDPOINTS.USERS.UPDATE(encodedEmail),
    (url: string, { arg }: { arg: UserUpdateDto }) => updateUser(url, arg),
    {
      onSuccess: async (data) => {
        // 세션 업데이트
        // - 🎯 서버 NextAuthConfig.callbacks.jwt 호출하여 세션 업데이트
        if (session) {
          await sessionUpdate({
            ...session,
            user: {
              ...session.user,
              role: data.role,
              name: data.name,
            },
          });
        }
      },
    }
  );
  return {
    userUpdateTrigger: trigger,
    userUpdateIsMutating: isMutating,
    userUpdateError: error,
  };
};

export const useGetUserByEmail = (email: string) => {
  const encodedEmail = email ? encodeURIComponent(email) : null;
  const { data, error, isLoading } = useSWR(
    encodedEmail ? API_ENDPOINTS.USERS.GET(encodedEmail) : null,
    getUserByEmail
  );

  return {
    user: data,
    userError: error,
    isLoading,
  };
};
