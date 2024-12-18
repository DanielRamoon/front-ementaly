import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { ProfessionalApi } from '../../apis';
import { IProfessional } from '../../libs';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';

interface RejectProfessionalDialogProps {
  open: boolean;

  professional: IProfessional;

  onClose: () => void;
  onComplete: () => void;
}

export const RejectProfessionalDialog = (
  props: RejectProfessionalDialogProps,
) => {
  const [reason, setReason] = useState('');
  const [isLoading, setLoading] = useState(false);

  const { formatMessage } = useIntl();

  const onSubmit = async () => {
    try {
      setLoading(true);

      await ProfessionalApi.alterStatus(
        props.professional.uuid,
        'rejected',
        reason,
      );

      toast.success(formatMessage({ id: 'rejectProfessionalDialog.rejected' }));

      props.onComplete();
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="rejectProfessionalDialog.title" />
      </CloseableDialogTitle>
      <DialogContent>
        <TextField
          label={formatMessage({
            id: 'rejectProfessionalDialog.input.reason.label',
          })}
          placeholder={formatMessage({
            id: 'rejectProfessionalDialog.input.reason.placeholder',
          })}
          value={reason}
          fullWidth
          variant="outlined"
          onChange={(event) => setReason(event.target.value)}
          rows={5}
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="default" disabled={isLoading}>
          <FormattedMessage id="rejectProfessionalDialog.button.cancel" />
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          color="primary"
          variant="contained"
          disableElevation>
          <FormattedMessage id="rejectProfessionalDialog.button.confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
