import { IClinicalFollowUp, IClinicalFollowUpQueryDTO, ICreateClinicalFollowUpDTO } from '../libs';
import AxiosInstance from './AxiosInstance';

export const ClinicalFollowUpApi = {
  save: async (payload: ICreateClinicalFollowUpDTO): Promise<void> => {
    await AxiosInstance.post('/clinical-follow-up', payload);
  },

  find: async (
    payload: IClinicalFollowUpQueryDTO,
  ): Promise<IClinicalFollowUp[]> => {
    const { data } = await AxiosInstance.get('/clinical-follow-up', {
      params: payload,
    });

    return data;
  },
};
