import { Ages } from './IAges';
import { IEducation } from './IEducation';
import { ProfessionalType } from './IProfessionalType';
import { ProfileStatus } from './IStatus';

export interface IProfessionalDTO {
  uuid: string;
  name: string;
  avatar?: string;
  crm?: string;
  crmState?: string;
  crp?: string;
  crpState?: string;
  actAs: ProfessionalType[];

  charges: number;
  sessionDuration: number;

  worksWith: Ages[];

  expertises: string[];

  education: IEducation[];

  aboutMe: string;

  status: ProfileStatus;
}
