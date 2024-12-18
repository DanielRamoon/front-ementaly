import { IExpertise } from './IExpertise';
import { ProfessionalType } from './IProfessionalType';
import { UserType } from './UserType';

export interface IFilterProfessionalsDTO {
  page: number;
  pageSize?: number;
  type?: UserType;
  search?: string;
  orderBy?: string;
  orderDirection?: string;

  actAs?: ProfessionalType[];
  expertises?: string[];
  statusFilters?: string[];

  linked?: boolean;
  random?: boolean;
}
