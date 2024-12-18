import { Avatar, Checkbox, Divider, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Formik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import { ScheduleApi } from '../../apis';
import { CloseableDialogTitle, DataSummary, TextField } from '../../components';
import { ICancelScheduleDTO, ISchedule } from '../../libs';

interface CancelScheduleDialogProps {
  open: boolean;

  schedule: ISchedule;

  onClose: () => void;
  onComplete: () => void;
}

export const CancelScheduleDialog = (props: CancelScheduleDialogProps) => {
  const [initialValues] = useState<ICancelScheduleDTO>({
    uuid: props.schedule.uuid,
    reason: '',
    cancelNextSchedules: false,
  });

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const { formatMessage } = useIntl();

  const onSubmit = async (values: ICancelScheduleDTO) => {
    try {
      await ScheduleApi.cancel(values);

      props.onComplete();
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
        <CloseableDialogTitle onClose={props.onClose}>
          {formatMessage({ id: 'cancelScheduleDialog.title' })}
        </CloseableDialogTitle>
        <div className="mb-4">
          <Divider />
        </div>
        <CancelScheduleDialogForm {...props} />
      </Dialog>
    </Formik>
  );
};

const CancelScheduleDialogForm = (props: CancelScheduleDialogProps) => {
  const formik = useFormikContext<ICancelScheduleDTO>();

  const { formatMessage } = useIntl();

  return (
    <>
      <DialogContent>
        <DataSummary
          title={formatMessage({ id: 'cancelScheduleDialog.professional' })}
          left={<Avatar src={props.schedule.professional.avatar} />}
          description={props.schedule.professional.name}
          linkTo={`/professional/profile/${props.schedule.professional.uuid}`}
          linkLabel={formatMessage({ id: 'cancelScheduleDialog.viewProfile' })}
        />

        <DataSummary
          title={formatMessage({ id: 'cancelScheduleDialog.patient' })}
          left={<Avatar src={props.schedule.patient.avatar} />}
          description={props.schedule.patient.name}
          linkTo={`/patient/profile/${props.schedule.patient.uuid}`}
          linkLabel={formatMessage({ id: 'cancelScheduleDialog.viewProfile' })}
        />

        <TextField
          name="reason"
          label={formatMessage({ id: 'cancelScheduleDialog.reason' })}
          placeholder={formatMessage({
            id: 'cancelScheduleDialog.reasonDetails',
          })}
          autoFocus
          multiline
          rows={5}
        />

        {props.schedule.group && (
          <FormControlLabel
            control={
              <Checkbox
                name="cancelNextSchedules"
                checked={formik.values.cancelNextSchedules}
                onChange={formik.handleChange}
              />
            }
            label={formatMessage({
              id: 'cancelScheduleDialog.cancelNextSchedules',
            })}
          />
        )}
      </DialogContent>

      <div className="mb-4">
        <Divider />
      </div>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}>
          {formatMessage({ id: 'cancelScheduleDialog.confirm' })}
        </Button>
      </DialogActions>
    </>
  );
};
