import { Chip, useTheme } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { PaymentStatus } from '../../libs';
import { getPaymentStatusMetadata } from '../../utils/getPaymentStatusMetadata';

interface PaymentStatusChipProps {
  status: PaymentStatus;
}

export const PaymentStatusChip = (props: PaymentStatusChipProps) => {
  const intl = useIntl();

  const metadata = getPaymentStatusMetadata({ status: props.status, intl });

  const theme = useTheme();

  return (
    <Chip
      label={metadata.label}
      style={{
        backgroundColor: metadata.color,
        color: theme.palette.getContrastText(metadata.color),
      }}
    />
  );
};
