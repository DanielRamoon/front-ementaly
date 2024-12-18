import { IAuthenticationToken, ICredentials } from '../libs';
import { IDayOfWeek } from '../libs/IDayOfWeek';
import AxiosInstance from './AxiosInstance';

export const WorkingScheduleApi = {
  alter: async (dto: IDayOfWeek): Promise<IAuthenticationToken> => {
    const { data } = await AxiosInstance.put('/professional/workingSchedule', {
      daysOfWeek: dto,
    });

    return data;
  },
};
