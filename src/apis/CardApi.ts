import { ICard } from '../libs/ICard';
import AxiosInstance from './AxiosInstance';

export const CardApi = {
  find: async (): Promise<any> => {
    const { data } = await AxiosInstance.get('/card');
    return data;
  },
  remove: async (cardId: string): Promise<void> => {
    const { data } = await AxiosInstance.delete(`/card/${cardId}`);
    return data;
  },
};
