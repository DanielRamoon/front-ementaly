import { IProfessionalDTO } from '../libs';
import AxiosInstance from './AxiosInstance';

export const ProfileApi = {
  create: async (dto: IProfessionalDTO): Promise<void> => {
    await AxiosInstance.post('/professional', dto);
  },
};
