import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { ProfessionalApi } from '../../apis';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';

interface ProfessionalProfileApprovalDialogProps {
  open: boolean;
  onClose: () => void;

  onConfirm: () => void;
}

export const ProfessionalProfileApprovalDialog = (
  props: ProfessionalProfileApprovalDialogProps,
) => {
  const [isLoading, setLoading] = useState(false);

  const intl = useIntl();

  const onSubmit = async () => {
    try {
      setLoading(true);

      await ProfessionalApi.requestApproval();

      props.onConfirm();
    } catch {
      toast.error(intl.formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="professionalProfileApprovalDialog.title" />
      </CloseableDialogTitle>
      <DialogContent>
        <Typography>
          <FormattedMessage id="professionalProfileApprovalDialog.description" />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={props.onClose} color="default">
          <FormattedMessage id="professionalProfileApprovalDialog.button.cancel" />
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          color="primary"
          variant="contained"
          disableElevation>
          <FormattedMessage id="professionalProfileApprovalDialog.button.submit" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
