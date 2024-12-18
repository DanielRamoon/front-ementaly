import { amber, blue, green, purple, red } from '@material-ui/core/colors';
import { IntlShape } from 'react-intl';

import { PaymentStatus } from '../libs';

export function getPaymentStatusMetadata(options: {
  status: PaymentStatus;
  intl: IntlShape;
}) {
  switch (options.status) {
    case 'paid':
      return {
        color: green[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.paid' }),
      };

    case 'processing':
      return {
        color: green[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.processing' }),
      };

    case 'refused':
      return {
        color: red[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.refused' }),
      };

    case 'waiting':
      return {
        color: blue[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.waiting' }),
      };

    case 'refunded':
      return {
        color: purple[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.refunded' }),
      };

    case 'cancelled':
      return {
        color: red[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.cancelled' }),
      };

    case 'skipped':
      return {
        color: green[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.skipped' }),
      };

    default:
      return {
        color: amber[500],
        label: options.intl.formatMessage({ id: 'paymentStatus.unknown' }),
      };
  }
}
