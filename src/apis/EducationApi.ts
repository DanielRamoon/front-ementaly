import { IEducation } from '../libs/IEducation';
import AxiosInstance from './AxiosInstance';

export const EducationApi = {
  create: async (dto: IEducation): Promise<IEducation> => {
    const { data } = await AxiosInstance.post<IEducation>(
      '/professional/education',
      dto,
    );

    return data;
  },
  delete: async (uuid: string): Promise<IEducation> => {
    const { data } = await AxiosInstance.delete<IEducation>(
      `/professional/education/${uuid}`,
    );

    return data;
  },
};
