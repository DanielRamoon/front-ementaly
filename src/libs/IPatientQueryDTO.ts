import { IPaginationDTO } from './IPaginationDTO';

export interface IPatientQueryDTO extends IPaginationDTO {
  search?: string;
}
