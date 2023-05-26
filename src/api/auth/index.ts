import {showMessage} from 'react-native-flash-message';
import {useMutation, UseMutationOptions} from 'react-query';
import {client, privateClient} from 'api/client';
import {AxiosError} from 'axios';
import {useAuth} from 'core/Auth';

import {
  AuthResponse,
  ChangePwDto,
  LoginDto,
  LoginGGDto,
  RegisterDto,
} from './types';

const loginGoogle = async (body: LoginGGDto): Promise<AuthResponse> => {
  const {data} = await client.post('/api/public/auth/login-gg', {
    ...body,
  });

  return data;
};

export const useLoginGoogle = () => {
  const [signIn, setUser] = useAuth(state => [state.signIn, state.setUser]);

  const mutation = useMutation((body: LoginGGDto) => loginGoogle(body), {
    onSuccess: data => {
      const {token, user} = data;
      signIn({
        access: `${token.accessToken}`,
        refresh: `${token.accessToken}`,
      });
      setUser(user);

      showMessage({message: 'Login successfully', type: 'success'});
    },
  });
  return mutation;
};

const login = async (body: LoginDto): Promise<AuthResponse> => {
  const {data} = await client.post('/api/public/auth/login', {
    ...body,
  });
  return data;
};

export const useLogin = () => {
  const [signIn, setUser] = useAuth(state => [state.signIn, state.setUser]);

  const mutation = useMutation((body: LoginDto) => login(body), {
    onSuccess: data => {
      const {token, user} = data;
      console.log('data: ', data);
      signIn({
        access: `${token.accessToken}`,
        refresh: `${token.accessToken}`,
      });
      setUser(user);
      showMessage({message: 'Login successfully', type: 'success'});
    },
  });
  return mutation;
};

const register = async (body: RegisterDto): Promise<AuthResponse> => {
  const {data} = await client.post('/api/public/auth/register', {
    ...body,
  });
  return data;
};

export const useRegister = () => {
  const [signIn, setUser] = useAuth(state => [state.signIn, state.setUser]);

  const mutation = useMutation((body: RegisterDto) => register(body), {
    onSuccess: data => {
      const {token, user} = data;
      signIn({
        access: `${token.accessToken}`,
        refresh: `${token.accessToken}`,
      });
      setUser(user);
      showMessage({message: 'Register successfully', type: 'success'});
    },
  });
  return mutation;
};

export const useChangePassword = () => {
  return useMutation(
    (payload: {password: string; oldPassword: string}) =>
      privateClient.put('/api/private/users/change-pw', {
        pw: payload.password,
        oldPw: payload.oldPassword,
      }) as Promise<AuthResponse>,

    {
      onError(error) {
        console.log('useChangePassword error: ', error);
      },
    },
  );
};

export const useSendOtp = (
  option: UseMutationOptions<unknown, AxiosError, unknown>,
) =>
  useMutation(
    async (email: string) =>
      (await client.get(`/api/public/auth/forgot-pw?email=${email}`)).data,
    option,
  );

export const useChangePwPublic = (
  option: UseMutationOptions<AuthResponse, AxiosError, ChangePwDto>,
) => {
  return useMutation(
    async (payload: ChangePwDto) =>
      (
        await client.post('/api/public/auth/change-pw', {
          ...payload,
        })
      ).data as unknown as Promise<AuthResponse>,
    {
      onError(error) {
        console.log('useChangePwPublic error: ', error);
      },
      ...option,
    },
  );
};
