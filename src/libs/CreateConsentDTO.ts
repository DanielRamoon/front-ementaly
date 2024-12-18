import { PatientConsentType } from './PatientConsentType';
import { Status } from './Status';

export interface CreateConsentDTO {
  professional: string;

  type: PatientConsentType;

  status: Status;
}
