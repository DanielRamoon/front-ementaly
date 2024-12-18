import { CreateConsentDTO } from '../libs';
import AxiosInstance from './AxiosInstance';

export const ConsentApi = {
  save: async (options: CreateConsentDTO): Promise<void> => {
    const { data } = await AxiosInstance.post('/patient-consent', options);

    return data;
  },
};
