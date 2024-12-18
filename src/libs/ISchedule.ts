import { IPatient } from './IPatient';
import { IProfessional } from './IProfessional';
import { IUser } from './IUser';
import { PaymentStatus } from './PaymentStatus';
import { ScheduleFulfillment } from './ScheduleFulfillment';

export interface ISchedule {
  professional: IProfessional;

  startingAt: string;
  endingAt: string;
  meetingUrl?: string;
  chargedValue: number;

  recurrence: number;
  recurrenceUntil: string | null;

  fulfillment: ScheduleFulfillment;

  paymentStatus: PaymentStatus;

  uuid: string;
  group: string;
  transaction: number;
  gateway: string;
  billingStrategy: string;
  status: string;

  cancelledAt: string | null;
  cancellingReason: string | null;
  cancelledBy: IUser;

  patient: IPatient;

  paymentConfirmedAt?: string;
  receiptUrl?: string;

  startedAt: string | null;
}
