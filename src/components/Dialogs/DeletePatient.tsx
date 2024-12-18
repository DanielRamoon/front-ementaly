import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';

interface Props {
  isOpen: boolean;
  handlerCloseDialog(): void;
  handlerSuccessDialog(): void;
}

export const DeletePatient: React.FC<Props> = ({
  isOpen,
  handlerCloseDialog,
  handlerSuccessDialog,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handlerCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage id="deletePatientDialog.title" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <FormattedMessage id="deletePatientDialog.description" />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlerCloseDialog} color="primary">
          <FormattedMessage id="deletePatientDialog.button.goBack" />
        </Button>
        <Button onClick={handlerSuccessDialog} color="secondary" autoFocus>
          <FormattedMessage id="deletePatientDialog.button.confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
