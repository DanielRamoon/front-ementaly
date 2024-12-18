import { Status, Statuses } from './Status';

export type ScheduleStatus = Status | 'confirmed' | 'completed';

export const ScheduleStatuses: Record<ScheduleStatus, ScheduleStatus> = {
  ...Statuses,
  confirmed: 'confirmed',
  completed: 'completed',
};
