import { IFilterPatientsDTO, IPatient, IPatientDTO, IPatientInviteDTO, IPatientQueryDTO } from '../libs';
import { IAnamneseSaveDTO } from '../libs/IAnameseSaveDTO';
import { IAnamnese } from '../libs/IAnamnese';
import { IAnamneseGetDTO } from '../libs/IAnamneseGetDTO';
import AxiosInstance from './AxiosInstance';

export const PatientApi = {
  async find(options: IPatientQueryDTO): Promise<IPatient[]> {
    const { data } = await AxiosInstance.get('/patient', { params: options });

    return data;
  },

  list: async (dto: IFilterPatientsDTO): Promise<Array<IPatient>> => {
    const { data } = await AxiosInstance.get<Array<IPatient>>('/patient', {
      params: dto,
    });
    return data;
  },
  listActive: async (dto: IFilterPatientsDTO): Promise<Array<IPatient>> => {
    const { data } = await AxiosInstance.get<Array<IPatient>>('/patient', {
      params: { ...dto, linked: true },
    });
    return data;
  },
  show: async (
    uuid: string,
    errorHandler?: { ignoreObjectNotFound: boolean },
  ): Promise<IPatient> => {
    const { data } = await AxiosInstance.get<IPatient>(`/patient/${uuid}`, {
      params: errorHandler,
    });
    return data;
  },
  save: async (dto: IPatientDTO): Promise<boolean> => {
    return AxiosInstance.post('/patient', dto);
  },
  invite: async (dto: IPatientInviteDTO): Promise<boolean> => {
    return AxiosInstance.post('/patient/invite', dto);
  },
  getAnamnese: async (dto: IAnamneseGetDTO): Promise<IAnamnese> => {
    const { data } = await AxiosInstance.get('/anamnese', { params: dto });
    return data;
  },
  saveAnamnese: async (dto: IAnamneseSaveDTO): Promise<any> => {
    return AxiosInstance.post('/anamnese', dto);
  },
};
