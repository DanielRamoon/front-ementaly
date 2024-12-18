import { IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Check, Close } from 'mdi-material-ui';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import { ScheduleApi } from '../../apis';
import { ISchedule } from '../../libs';

interface FinishScheduleDialogProps {
  open: boolean;

  schedule: ISchedule;

  onClose: () => void;
  onComplete: () => void;
}

export const FinishScheduleDialog = (props: FinishScheduleDialogProps) => {
  const [isLoading, setLoading] = useState(false);

  const { formatMessage } = useIntl();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      await ScheduleApi.finish({ uuid: props.schedule.uuid });

      props.onComplete();
    } catch {
      // TODO
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="finish-schedule-dialog">
      <div className="p-8 py-16">
        <div className="flex justify-end mb-4">
          <IconButton onClick={props.onClose}>
            <Close />
          </IconButton>
        </div>

        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-primary">
            <Check style={{ fontSize: 72, color: 'white' }} />
          </div>
        </div>

        <div className="mb-8">
          <Typography variant="h5" align="center" gutterBottom>
            <b>{formatMessage({ id: 'finishScheduleDialog.title' })}</b>
          </Typography>
          <Typography variant="body2" align="center">
            {formatMessage({ id: 'finishScheduleDialog.description' })}
          </Typography>
        </div>

        <div className="flex justify-center">
          <div className="mr-4">
            <Button
              disabled={isLoading}
              variant="outlined"
              onClick={props.onClose}
              color="default">
              {formatMessage({ id: 'finishScheduleDialog.button.goBack' })}
            </Button>
          </div>

          <div>
            <Button
              disabled={isLoading}
              disableElevation
              variant="contained"
              color="primary"
              onClick={onSubmit}>
              {formatMessage({ id: 'finishScheduleDialog.button.confirm' })}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
