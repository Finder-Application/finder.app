/// Auth.tsx
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Me} from 'api/auth/types';
import {StorageName} from 'core/constants';
import {zustandStorage} from 'core/ZustandStorage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {getToken, removeToken, setToken, TokenType} from './utils';

GoogleSignin.configure({
  webClientId:
    '217050693116-3ka33u4v0p21ajau3a11mgee86obbvbq.apps.googleusercontent.com',
  offlineAccess: true,
});

interface UserInform {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  isLoggedIn: boolean;
  isLoggedInGoogle: boolean;
  user?: Me;
  setUser: (value: Me) => void;
  setIsLoggedInGoogle: (value: boolean) => void;
  signIn: (data: TokenType) => void;
  signInGoogle: () => Promise<{
    idToken: string | null;
    user: UserInform;
  }>;
  signOut: () => Promise<void>;
  hydrate: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      token: null,
      isLoggedInGoogle: false,
      isLoggedIn: false,
      user: undefined,
      setUser: value => {
        set({user: value});
      },
      setIsLoggedInGoogle: value => {
        set({isLoggedInGoogle: value});
      },
      signInGoogle: async () => {
        await GoogleSignin.hasPlayServices();
        const {idToken, user} = await GoogleSignin.signIn();
        set({isLoggedInGoogle: true});
        return {idToken, user};
      },
      signIn: token => {
        try {
          setToken(token);
          set({status: 'signIn', token, isLoggedIn: true});
        } catch (error) {
          console.log('error: ', JSON.stringify(error));
        }
      },
      signOut: async () => {
        try {
          if (get().isLoggedInGoogle) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            set({isLoggedInGoogle: false});
          }
          removeToken();
          set({
            status: 'signOut',
            token: null,
            user: undefined,
            isLoggedIn: false,
          });
        } catch (error) {
          console.log('signOut error: ', JSON.stringify(error));
        }
      },
      hydrate: () => {
        try {
          const userToken = getToken();
          console.log({userToken});
          if (userToken !== null) {
            get().signIn(userToken);
          } else {
            get().signOut();
          }
        } catch (e) {
          // catch error here
          // Maybe sign_out user!
        }
      },
    }),
    {
      name: StorageName.Auth,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

const authState = useAuth.getState();

export const signInGoogle = () => authState.signInGoogle();
export const signOut = () => useAuth.getState().signOut();
export const hydrateAuth = () => useAuth.getState().hydrate();
