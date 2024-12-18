import { Divider } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

interface TrialExpiredDialogProps {
  open: boolean;
  isTrial: boolean;
  onClick: () => void;
}

export const TrialExpiredDialog: React.FC<TrialExpiredDialogProps> = (
  props,
) => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  return (
    <Dialog open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>
        {formatMessage({
          id: `trialExpiredDialog.${props.isTrial ? 'title' : 'titleNotTrial'}`,
        })}
      </DialogTitle>
      <Divider />
      <DialogContent className="mb-4">
        <div
          style={{
            width: '100%',
            height: '40dvh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2rem',
            textAlign: 'center',
          }}>
          {formatMessage({
            id: `trialExpiredDialog.${props.isTrial ? 'text' : 'textNotTrial'}`,
          })}
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={props.onClick}
          color="primary">
          {formatMessage({
            id: `trialExpiredDialog.${props.isTrial ? 'button' : 'continue'}`,
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
