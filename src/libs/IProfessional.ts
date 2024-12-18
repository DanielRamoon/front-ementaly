import { Ages } from './IAges';
import { IDayOfWeek } from './IDayOfWeek';
import { IEducation } from './IEducation';
import { IExpertise } from './IExpertise';
import { ProfessionalType } from './IProfessionalType';
import { ProfileStatus } from './IStatus';
import { IUser } from './IUser';

export interface IProfessional {
  uuid: string;
  name: string;
  avatar?: string;
  birthDate: string | null;
  documentNumber: string;
  crm?: string;
  crp?: string;
  crpState?: string;
  crmState?: string;
  actAs: ProfessionalType[];

  charges: number;
  email: string;
  sessionDuration: number;

  recipient?: string;

  worksWith: Ages[];

  expertises: IExpertise[];

  education: IEducation[];

  aboutMe: string;

  status: ProfileStatus;

  rejectionReason: string | null;

  user: IUser;

  workingSchedule: IDayOfWeek;

  linkedin?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  showWhatsapp: boolean;
  externalUrl?: string;
  servicesMade?: number;
}
