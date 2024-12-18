export type BillingStrategy = 'payNow' | 'payLater';

export const BillingStrategies: Record<BillingStrategy, BillingStrategy> = {
  payNow: 'payNow',
  payLater: 'payLater',
};
