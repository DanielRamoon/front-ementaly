import { IPaginationDTO } from './IPaginationDTO';
import { PaymentStatus } from './PaymentStatus';

export interface ScheduleQueryDTO extends IPaginationDTO {
  patient?: string;

  professional?: string;

  until?: string;

  from?: string;

  paymentStatus?: PaymentStatus;
}
