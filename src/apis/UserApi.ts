import {
  IAuthenticationToken,
  ICredentials,
  IForgetPassword,
  IUserInviteDTO,
  SignUpDTO,
} from '../libs';
import AxiosInstance from './AxiosInstance';

export const UserApi = {
  authenticate: async (dto: ICredentials): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.post('/sign-in', dto);
    
    return data;
  },

  delete: async (uuid: string): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.delete(`/user/clear/${uuid}`);

    return data;
  },
  register: async (dto: SignUpDTO): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.post('/auth/sign-up', dto);

    return data;
  },

  signIn: async (): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.post('/auth/sign-in', undefined, {
      params: { ignoreObjectNotFound: true },
    });

    console.log('----------------------- AKI 3-----------------------------');
    console.log(data);
    console.log('----------------------- AKI 3-----------------------------');


    return data;
  },

  forgetPassword: async (dto: IForgetPassword): Promise<boolean> => {
    await AxiosInstance.post('/recover-password', dto).catch(() => {
      return false;
    });

    return true;
  },

  invite: async (dto: IUserInviteDTO): Promise<boolean> => {
    return AxiosInstance.post('/user/invite', dto);
  },

  find: async (uuid: string): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.delete(`/user/find/${uuid}`);

    return data;
  },
};
