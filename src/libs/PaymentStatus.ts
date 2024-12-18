export type PaymentStatus =
  | 'waiting'
  | 'paid'
  | 'processing'
  | 'refused'
  | 'refunded'
  | 'cancelled'
  | 'skipped';

export const PaymentStatuses: Record<PaymentStatus, PaymentStatus> = {
  waiting: 'waiting',
  paid: 'paid',
  processing: 'processing',
  cancelled: 'cancelled',
  refused: 'refused',
  refunded: 'refunded',
  skipped: 'skipped',
};
