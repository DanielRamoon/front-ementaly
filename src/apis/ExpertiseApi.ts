import { IExpertise } from '../libs';
import AxiosInstance from './AxiosInstance';

export const ExpertiseApi = {
  create: async (name: string): Promise<IExpertise> => {
    const { data } = await AxiosInstance.post<IExpertise>('/expertise', {
      name,
    });

    return data;
  },
  list: async (search?: string): Promise<IExpertise[]> => {
    let params = {};

    if (search) {
      params = { name: search };
    }

    const { data } = await AxiosInstance.get<IExpertise[]>(`/expertise`, {
      params,
    });

    return data;
  },
};
