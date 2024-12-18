import {
  CreateBankAccountDTO,
  IFilterProfessionalsDTO,
  IMemedTokenPayload,
  IProfessional,
  IProfessionalDTO,
  ProfileStatus,
} from '../libs';
import { ProfessionalPaymentFormData } from '../pages/ProfessionalPayment/ProfessionalPayment';
import AxiosInstance from './AxiosInstance';

export const ProfessionalApi = {
  list: async (dto: IFilterProfessionalsDTO): Promise<Array<IProfessional>> => {
    const { data } = await AxiosInstance.get<Array<IProfessional>>(
      '/professional',
      {
        params: dto,
      },
    );
    return data;
  },
  listPublic: async (
    dto: IFilterProfessionalsDTO,
  ): Promise<Array<IProfessional>> => {
    const { data } = await AxiosInstance.get<Array<IProfessional>>(
      '/professional/public',
      {
        params: dto,
      },
    );
    return data;
  },
  show: async (
    uuid: string,
    errorHandler?: { ignoreObjectNotFound: boolean },
  ): Promise<IProfessional> => {
    const { data } = await AxiosInstance.get<IProfessional>(
      `/professional/${uuid}`,
      {
        params: errorHandler,
      },
    );
    return data;
  },

  showPublic: async (
    uuid: string,
    errorHandler?: { ignoreObjectNotFound: boolean },
  ): Promise<IProfessional> => {
    const { data } = await AxiosInstance.get<IProfessional>(
      `/professional/public/${uuid}`,
      {
        params: errorHandler,
      },
    );
    return data;
  },

  requestApproval: async (): Promise<void> => {
    await AxiosInstance.patch('/professional/request-approval');
  },

  findLinked: async (): Promise<IProfessional[]> => {
    const { data } = await AxiosInstance.get('/professional/linked');

    return data;
  },
  update: async (dto: IProfessionalDTO): Promise<void> => {
    const result = await AxiosInstance.put('/professional', dto);
    console.log('result -> ', result);
  },
  alterStatus: async (
    uuid: string,
    status: ProfileStatus,
    reason?: string,
  ): Promise<boolean> => {
    await AxiosInstance.patch(`/professional/${uuid}/status`, {
      status,
      reason,
    }).catch(() => {
      return false;
    });

    return true;
  },
  setBankAccount: async (dto: CreateBankAccountDTO): Promise<void> => {
    await AxiosInstance.put('/professional/bankAccount', dto);
  },
  findBankAccount: async (): Promise<CreateBankAccountDTO> => {
    const { data } = await AxiosInstance.get('/professional/bankAccount');

    return data;
  },

  findMemedToken: async (): Promise<IMemedTokenPayload> => {
    const { data } = await AxiosInstance.get('/professional/memedToken');

    return data;
  },
  monthlyPayment: async (body: ProfessionalPaymentFormData): Promise<any> => {
    const { data } = await AxiosInstance.post(
      '/professional/receive-payment',
      body,
    );
    return data;
  },
};
