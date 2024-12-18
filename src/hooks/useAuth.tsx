import 'firebase/auth';

import firebase from 'firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { UserApi,ProfessionalApi } from '../apis';




import { ICredentials, SignUpDTO, UserType } from '../libs';
import { IAuthenticationToken } from '../libs/IAuthenticationToken';
import { LocalStorage } from '../services/LocalStorage';
import { useDeviceToken } from './useDeviceToken';

class MissingUserType extends Error {}

interface IAuthContext {
  isAuthenticated: boolean;
  register(data: SignUpDTO): Promise<boolean>;
  authenticate: (data: ICredentials) => Promise<boolean>;
  authenticateGmail: () => void;
  resetPassword: (email: string) => void;
  logout: () => void;
  token: string | null;
  currentUser: IAuthenticationToken | null;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<IAuthenticationToken | null>
  >;
  getFirestoreRef: () => firebase.firestore.DocumentReference;
}

const AuthContext = createContext({} as IAuthContext);

const verifyIsAuthenticated = (): boolean => {
  if (typeof localStorage !== 'undefined') {
    const token = LocalStorage.getToken();
    if (token) return true;
  }
  return false;
};

export const goDashboard = (type: UserType | undefined): void => {
  switch (type) {
    case 'admin':
      window.location.href = '/admin/professionals';
      break;
    case 'professional':
      window.location.href = '/professional/profile';
      break;
    case 'patient':
      window.location.href = '/patient/profile';
      break;
    case 'guest':
      window.location.href = '/';
      break;
    default:
      window.location.href = '/';
      break;
  }
};

export const AuthProvider: React.FC = ({ children }) => {
  const Intl = useIntl();
  const [currentUser, setCurrentUser] = useState<IAuthenticationToken | null>(
    null,
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    verifyIsAuthenticated(),
  );
  const token = LocalStorage.getToken();

  const isSignInMethodAvailable = async (email: string, methodName: string) => {
    const authMethods = await firebase
      .app()
      .auth()
      .fetchSignInMethodsForEmail(email);

    if (!authMethods.some((authMethod) => authMethod === methodName)) {
      toast.error(
        Intl.formatMessage(
          { id: 'auth.wrongMethod' },
          {
            availableMethods: authMethods
              .map((method) =>
                Intl.formatMessage({ id: `auth.signInMethod_${method}` }),
              )
              .join(', '),
          },
        ),
      );

      return false;
    }

    return true;
  };

  const authenticate = async (dto: ICredentials): Promise<boolean> => {
    const isMethodAvailable = await isSignInMethodAvailable(
      dto.email,
      'password',
    );

    if (!isMethodAvailable) {
      return false;
    }

    return firebase
      .app()
      .auth()
      .signInWithEmailAndPassword(dto.email, dto.password)
      .then(async (credential) => {
        return credential.user?.getIdToken();
      })
      .then((jwt: string | undefined) => {
        if (!jwt) throw new Error();

        LocalStorage.setToken(jwt);

        setIsAuthenticated(true);
      })
      .then(() => {
        setIsAuthenticated(true);
        const dados = UserApi.signIn();

        // console.log('----------------------- AKI 1 -----------------------------');
        // console.log(dados);
        // console.log('----------------------- AKI 1 -----------------------------');

        return dados;
      })
      .then(async (user) => {
        // console.log('----------------------- AKI -----------------------------');
        // console.log(user);
        // console.log('----------------------- AKI -----------------------------');

        LocalStorage.setUser(user);

        if (user.uuid) {
          await firebase
            .firestore()
            .collection('users')
            .doc(user.uuid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
                return doc.ref.set({ name: user.name });
              }

              return Promise.resolve();
            });
        }

        // console.log('----------------------- AKI -----------------------------');
        // console.log(user.type);
        // console.log('----------------------- AKI -----------------------------');

        // const professional = await ProfessionalApi.showPublic(user.uuid, {
        //   ignoreObjectNotFound: false,
        // });
        // console.log(professional);
        // console.log(user.uuid);
        // return false;
        setCurrentUser(user);

        goDashboard(user.type);

        return true;
      })
      .catch((error) => {
        console.log('Err: ', error);

        if (error.response?.data?.key === 'invalidUserStatus') {
          toast.error(
            'Seu cadastro foi inativado. Para maiores esclarecimentos entre em contato com nosso suporte',
            { autoClose: false },
          );
        }

        toast.error(
          error.response?.data ||
            'Não foi possível realizar seu acesso, tente novamente',
        );
        return false;
      });
  };

  const resetPassword = async (email: string): Promise<void> => {
    return firebase
      .app()
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success(
          Intl.formatMessage({ id: 'forgetPassword.toast.success' }),
        );
      })
      .catch(() => {
        toast.error(Intl.formatMessage({ id: 'forgetPassword.toast.error' }));
      });
  };

  const authenticateGmail = async (): Promise<void> => {
    console.log('start!!');
    const firebaseApp = firebase.app();

    const firebaseAppAuth = firebaseApp.auth();

    console.log('start 22!!');
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log('start 33!!');
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    console.log('start 44!!');

    firebaseAppAuth
      .signInWithPopup(provider)
      .then(async (credential) => {
        console.log({ credential });
        const jwt = await credential.user?.getIdToken();

        if (!jwt) throw new Error();

        LocalStorage.setToken(jwt);

        setIsAuthenticated(true);

        if (credential.additionalUserInfo?.isNewUser) {
          throw new MissingUserType();
        }
        console.log({ jwt });

        return jwt;
      })
      .then(() => {
        setIsAuthenticated(true);

        return UserApi.signIn();
      })
      .then(async (user) => {
        LocalStorage.setUser(user);

        if (user.uuid) {
          await firebase
            .firestore()
            .collection('users')
            .doc(user.uuid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
                return doc.ref.set({
                  name: user.name,
                });
              }

              return Promise.resolve();
            });
        }

        setCurrentUser(user);

        goDashboard(user.type);
        return true;
      })
      .catch((error) => {
        if (error.response?.data?.key === 'invalidUserStatus') {
          toast.error(
            'Seu cadastro foi inativado. Para maiores esclarecimentos entre em contato com nosso suporte',
            { autoClose: false },
          );
        }

        if (
          error instanceof MissingUserType ||
          error.response?.data?.key === 'objectNotFound'
        ) {
          setIsAuthenticated(true);

          window.location.href = '/account-type';

          return true;
        }

        toast.error(
          error.response?.data ||
            'Não foi possível realizar seu acesso, tente novamente',
        );
        return false;
      });
  };

  const register = async (
    dto: SignUpDTO & { password: string },
  ): Promise<boolean> => {
    return firebase
      .app()
      .auth()
      .createUserWithEmailAndPassword(dto.email, dto.password)
      .then((credential) => {
        console.log({ credential });
        return credential.user?.getIdToken();
      })
      .then((jwt: string | undefined) => {
        console.log({ jwt });
        if (!jwt) throw new Error();

        LocalStorage.setToken(jwt);
      })
      .then(() => {
        console.log('cheguei na API', dto);
        return UserApi.register(dto);
      })
      .then(async (user) => {
        setIsAuthenticated(true);
        console.log('----------------------- SET USER LOCAL STORAGE -----------------------------');
        console.log({ user });
        LocalStorage.setUser(user);

        if (user.uuid) {
          await firebase
            .firestore()
            .collection('users')
            .doc(user.uuid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
                return doc.ref.set({ name: user.name });
              }

              return Promise.resolve();
            });
        }

        setCurrentUser(user);

        toast.success(Intl.formatMessage({ id: 'signup.toast.success' }));

        goDashboard(user.type);

        return true;
      })
      .catch((error) => {
        toast.error(
          Intl.formatMessage({ id: `signup.toast.erros.${error.code}` }) ||
            'Não foi possível realizar seu acesso, tente novamente',
        );
        return false;
      });
  };

  const { clearDeviceToken } = useDeviceToken();

  const logout = async (): Promise<void> => {
    await clearDeviceToken();

    setIsAuthenticated(false);
    setCurrentUser(null);

    await firebase.auth().signOut();

    LocalStorage.clear();

    window.location.href = '/login';
  };

  const getFirestoreRef = React.useCallback((): firebase.firestore.DocumentReference => {
    return firebase.firestore().collection('/users').doc(currentUser?.uuid);
  }, [currentUser]);

  const onAuthStateChanged = React.useCallback(async () => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authState) => {
      if (authState) {
        setCurrentUser(LocalStorage.getUser());
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        logout,
        authenticate,
        authenticateGmail,
        resetPassword,
        register,
        currentUser,
        setCurrentUser,
        getFirestoreRef,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): IAuthContext => useContext(AuthContext);

export default useAuth;
