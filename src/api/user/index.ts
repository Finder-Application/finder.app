import {useMutation, useQuery} from 'react-query';
import {Me} from 'api/auth/types';
import {client} from 'api/client';
import {User} from 'api/posts/types';
import {useAuth} from 'core';
import {getToken} from 'core/Auth/utils';

export interface UpdateUserInformationBody {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  isActive?: boolean;
  gender?: boolean;
  avatar?: string;
  social?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export const useGetInfoUser = (id?: number, enabled: boolean = true) => {
  return useQuery(['useGetInfoUser', id], {
    queryFn: (): Promise<User> => client.get(`/api/public/users/info/${id}`),
    staleTime: 5 * 60 * 60,
    enabled: !!id && enabled,
    keepPreviousData: true,
  });
};

export const useUpdateUserInformation = () => {
  const [currentUser, setUser] = useAuth(state => [state.user, state.setUser]);
  const mutation = useMutation(['UPDATE_USER'], {
    mutationFn: (params: {body: UpdateUserInformationBody}): Promise<Me> => {
      return client
        .put('api/private/users', params.body, {
          headers: {Authorization: `Bearer ${getToken()?.access}`},
        })
        .then(res => res.data);
    },
    onSuccess(data) {
      setUser({...currentUser, ...data});
    },
  });
  return mutation;
};
