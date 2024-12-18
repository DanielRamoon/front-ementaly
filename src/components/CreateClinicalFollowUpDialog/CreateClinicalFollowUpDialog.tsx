import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ClinicalFollowUpApi } from '../../apis';
import { IClinicalFollowUp, IPatient } from '../../libs';
import { transformClassValidatorToFormikErrors } from '../../utils/transformClassValidatorToFormikErrors';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';
import { TextField } from '../TextField/TextField';

interface CreateClinicalFollowUpDialogProps {
  open: boolean;

  onClose: () => void;
  onComplete: () => void;

  patient: IPatient;

  mode?: 'dialog' | 'inline';

  followUp: IClinicalFollowUp | null;
}

type ClinicalFollowUpFormData = { uuid?: string; notes: string };

export const CreateClinicalFollowUpDialog = (
  props: CreateClinicalFollowUpDialogProps,
) => {
  const [initialValues, setInitialValues] = useState<ClinicalFollowUpFormData>({
    notes: '',
  });

  const onSubmit = async (
    value: ClinicalFollowUpFormData,
    bag: FormikHelpers<ClinicalFollowUpFormData>,
  ) => {
    try {
      bag.setSubmitting(true);

      await ClinicalFollowUpApi.save({
        ...value,
        patient: props.patient.uuid,
      });

      props.onComplete();

      bag.resetForm();
    } catch (error) {
      bag.setErrors(transformClassValidatorToFormikErrors(error));
    } finally {
      bag.setSubmitting(false);
    }
  };

  let content: any = null;

  if (props.mode === 'inline') {
    content = !props.open ? null : <CreateClinicalFollowUpForm {...props} />;
  } else {
    content = (
      <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth>
        <CloseableDialogTitle onClose={props.onClose}>
          <FormattedMessage id="createClinicalFollowUpDialog.title" />
          {!props.followUp
            ? ''
            : ` - ${moment(props.followUp?.createdAt).format('DD/MM/YYYY')}`}
        </CloseableDialogTitle>
        <CreateClinicalFollowUpForm {...props} />
      </Dialog>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={props.followUp || initialValues}
      onSubmit={onSubmit}>
      {content}
    </Formik>
  );
};

const CreateClinicalFollowUpForm = (
  props: CreateClinicalFollowUpDialogProps,
) => {
  const { formatMessage } = useIntl();

  const formik = useFormikContext();

  const isSubmitDisabled =
    formik.isSubmitting ||
    (!props.followUp
      ? false
      : Math.abs(moment(props.followUp.createdAt).diff(undefined, 'hours')) >
        24);

  return (
    <>
      <DialogContent>
        <TextField
          name="notes"
          label={formatMessage({
            id: 'createClinicalFollowUpDialog.input.notes.label',
          })}
          placeholder={formatMessage({
            id: 'createClinicalFollowUpDialog.input.notes.placeholder',
          })}
          rows={5}
          multiline
          InputProps={{ disabled: isSubmitDisabled }}
          disabled={isSubmitDisabled}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          color="default"
          disabled={formik.isSubmitting}>
          <FormattedMessage id="createClinicalFollowUpDialog.button.cancel" />
        </Button>

        <Button
          disabled={isSubmitDisabled}
          onClick={() => formik.handleSubmit()}
          disableElevation
          variant="contained"
          color="primary">
          <FormattedMessage id="createClinicalFollowUpDialog.button.confirm" />
        </Button>
      </DialogActions>
    </>
  );
};
