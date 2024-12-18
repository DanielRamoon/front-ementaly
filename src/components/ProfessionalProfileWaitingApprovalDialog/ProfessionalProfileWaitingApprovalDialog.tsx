import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';

interface ProfessionalProfileWaitingApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ProfessionalProfileWaitingApprovalDialog = (
  props: ProfessionalProfileWaitingApprovalDialogProps,
) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="professionalProfileWaitingApprovalDialog.title" />
      </CloseableDialogTitle>
      <DialogContent>
        <Typography>
          <FormattedMessage id="professionalProfileWaitingApprovalDialog.description" />
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
