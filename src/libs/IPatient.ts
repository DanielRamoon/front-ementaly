import { DynamicStatus } from './IDynamicStatus';
import { ProfileStatus } from './IStatus';
import { IUser } from './IUser';
import { Status } from './Status';

export interface IPatient {
  uuid: string;
  avatar: string;
  birthDate: string;
  name: string;
  email: string;
  documentNumber: string;
  phoneNumber: string;
  user: IUser;
  dynamicStatus: DynamicStatus;

  status: Status;

  nextSchedule: null | {
    billingStrategy: string;
    chargedValue: number;
    endingAt: Date;
    fulfillment: string;
    gateway: string;
    group: string;
    meetingUrl: null;
    paymentConfirmedAt: Date;
    paymentStatus: string;
    receiptUrl: string;
    recurrence: number;
    startingAt: Date;
    status: ProfileStatus;
    transaction: string | null;
    uuid: string;
  };
}
