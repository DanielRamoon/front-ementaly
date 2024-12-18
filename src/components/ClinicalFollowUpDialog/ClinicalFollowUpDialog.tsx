import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IPatient } from '../../libs';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';
import { ListClinicalFollowUp } from '../ListClinicalFollowUp/ListClinicalFollowUp';

interface ClinicalFollowUpDialogProps {
  open: boolean;

  patient: IPatient;

  onClose: () => void;
}

export const ClinicalFollowUpDialog = (props: ClinicalFollowUpDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="clinicalFollowUpDialog.title" />
      </CloseableDialogTitle>
      <DialogContent>
        <ListClinicalFollowUp patient={props.patient} />
      </DialogContent>
    </Dialog>
  );
};
