import { BillingStrategy } from './BillingStrategy';
import { ScheduleFulfillment } from './ScheduleFulfillment';

export interface CreateScheduleDTO {
  patient: string;

  startingAt: string;

  endingAt: string;

  chargedValue: number;

  recurrence: number;

  recurrenceUntil?: string;

  billingStrategy: BillingStrategy;

  fulfillment: ScheduleFulfillment;
}
