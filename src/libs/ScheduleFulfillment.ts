export type ScheduleFulfillment = 'online' | 'inPerson';

export const ScheduleFulfillments: Record<
  ScheduleFulfillment,
  ScheduleFulfillment
> = {
  online: 'online',
  inPerson: 'inPerson',
};
