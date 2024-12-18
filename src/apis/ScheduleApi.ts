import {
  CreateScheduleDTO,
  ICancelScheduleDTO,
  IFilterSchedule,
  IResource,
  ISchedule,
  PublicCreateScheduleDTO,
  ScheduleQueryDTO,
} from '../libs';
import { IScheduleAvailable } from '../libs/IScheduleAvailable';
import { IScheduleAvailableDTO } from '../libs/IScheduleAvailableDTO';
import { ISendReceiptDTO } from '../libs/ISendReceiptDTO';
import AxiosInstance from './AxiosInstance';

export const ScheduleApi = {
  async save(payload: CreateScheduleDTO): Promise<IResource[]> {
    const { data } = await AxiosInstance.post('/schedule', payload);

    return data;
  },

  async savePublic(payload: PublicCreateScheduleDTO): Promise<IResource> {
    const { data } = await AxiosInstance.post('/schedule/public', payload);

    return data;
  },

  async find(payload: ScheduleQueryDTO): Promise<ISchedule[]> {
    const { data } = await AxiosInstance.get('/schedule', { params: payload });

    return data;
  },

  async findOne(payload: IResource): Promise<ISchedule> {
    const { data } = await AxiosInstance.get(`/schedule/${payload.uuid}`);

    return data;
  },

  list: async (dto: IFilterSchedule): Promise<ISchedule[]> => {
    const { data } = await AxiosInstance.get('/schedule', {
      params: dto,
    });

    return data;
  },

  listDateAvailable: async (options: {
    professional: string;
    from: string;
    until: string;
  }): Promise<IScheduleAvailable> => {
    const { data } = await AxiosInstance.get(
      `/professional/${options.professional}/workingSchedule`,
      {
        params: {
          from: options.from,
          until: options.until,
        },
      },
    );

    return data;
  },

  listHoursAvailable: async ({
    uuid,
    dateSelect,
  }: IScheduleAvailableDTO): Promise<IScheduleAvailable> => {
    const { data } = await AxiosInstance.get(
      `/professional/${uuid}/workingSchedule`,
      {
        params: {
          date: new Date(dateSelect),
        },
      },
    );

    return data;
  },

  cancel: async (dto: ICancelScheduleDTO): Promise<void> => {
    const { data } = await AxiosInstance.patch(
      `/schedule/${dto.uuid}/cancel`,
      dto,
    );

    return data;
  },

  start: async (dto: IResource): Promise<void> => {
    const { data } = await AxiosInstance.patch(`/schedule/${dto.uuid}/start`);

    return data;
  },

  finish: async (dto: IResource): Promise<void> => {
    const { data } = await AxiosInstance.patch(`/schedule/${dto.uuid}/finish`);

    return data;
  },

  sendReceipt: async (dto: ISendReceiptDTO): Promise<boolean> => {
    const data = { receiptUrl: dto.url };
    await AxiosInstance.patch(`/schedule/${dto.uuid}/receipt`, data).catch(
      () => {
        throw new Error('Erro send receipt');
      },
    );

    return true;
  },
};
