import { IProfessional } from './IProfessional';

export interface IPrescription {
  uuid: string;
  createdAt: string;
  professional: IProfessional;
}
