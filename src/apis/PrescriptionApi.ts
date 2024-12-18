import {
  ICreatePrescriptionDTO,
  IFindPrescriptionDTO,
  IPrescription,
  IPrescriptionDocumentPayload,
  IResource,
} from '../libs';
import AxiosInstance from './AxiosInstance';

export const PrescriptionApi = {
  async save(dto: ICreatePrescriptionDTO): Promise<IResource> {
    const { data } = await AxiosInstance.post('/prescription', dto);

    return data;
  },

  async find(dto: IFindPrescriptionDTO): Promise<IPrescription[]> {
    const { data } = await AxiosInstance.get('/prescription', { params: dto });

    return data;
  },

  async findDocument(
    dto: IFindPrescriptionDTO,
  ): Promise<IPrescriptionDocumentPayload> {
    const { data } = await AxiosInstance.get(
      `/prescription/${dto.uuid}/document`,
      {
        params: dto,
      },
    );

    return data;
  },
};
