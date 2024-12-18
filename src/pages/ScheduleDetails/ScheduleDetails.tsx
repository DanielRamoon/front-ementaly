import {
  Avatar,
  Box,
  Button,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import ReactGA from 'react-ga4';
import {
  Alarm,
  AlertOutline,
  CheckAll,
  CloseCircleOutline,
  OpenInNew,
} from 'mdi-material-ui';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ScheduleApi } from '../../apis';
import {
  DataSummary,
  LoadingContainer,
  OrderSummary,
  PaymentStatusChip,
  TitleDashboard,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import {
  IResource,
  ISchedule,
  PaymentStatuses,
  ScheduleStatuses,
} from '../../libs';
import { useCheckoutStyles } from '../Checkout/useCheckoutStyles';
import { CancelScheduleDialog } from './CancelScheduleDialog';
import { FinishScheduleDialog } from './FinishScheduleDialog';

interface ScheduleDetailsProps extends RouteComponentProps<IResource> {}

type Dialogs = 'cancel' | 'finish' | null;

const RedButton = withStyles({
  root: {
    background: red[500],
    color: 'white',
  },
})(Button);

export const ScheduleDetails = (props: ScheduleDetailsProps) => {
  const [isLoading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<Dialogs>(null);
  const [schedule, setSchedule] = useState<ISchedule | null>(null);

  const [startingAtLabel, setStartingAtLabel] = useState('');

  const find = React.useCallback(async (uuid: string) => {
    try {
      setLoading(true);

      const result = await ScheduleApi.findOne({ uuid });

      const startingAt = Moment(result.startingAt);
      const endingAt = Moment(result.endingAt);

      setStartingAtLabel(
        `${startingAt.format('DD/MM/YYYY [de] HH:mm')} às ${endingAt.format(
          'HH:mm',
        )}`,
      );

      setSchedule(result);
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    find(props.match.params.uuid);
  }, [props.match.params.uuid]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const { formatMessage } = useIntl();

  const styles = useCheckoutStyles();

  const { currentUser } = useAuth();

  if (!schedule) {
    return null;
  }

  const canActOnSchedule =
    schedule.status === ScheduleStatuses.active ||
    schedule.status === ScheduleStatuses.confirmed;

  const payableStatuses = [PaymentStatuses.waiting, PaymentStatuses.refused];

  const displayCheckoutButton =
    schedule.status === ScheduleStatuses.active &&
    schedule.patient.uuid === currentUser?.uuid &&
    payableStatuses.some((status) => status === schedule.paymentStatus);

  const handleMeetStart = () => {
    ScheduleApi.start({ uuid: props.match.params.uuid }).then(() => {
      setSchedule((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          startedAt: Moment().toISOString(),
        };
      });
    });
  };

  return (
    <LoadingContainer loading={isLoading}>
      <TitleDashboard>
        <FormattedMessage id="checkout.title" />
      </TitleDashboard>

      <div className="p-2 lg:p-8">
        <Grid container spacing={4} justify="space-around">
          <Grid item xs={12} md={8} lg={7}>
            <div className="bg-white p-2 lg:p-8 flex-1 md:mr-8">
              {canActOnSchedule && (
                <div className="flex justify-end mb-8">
                  {!schedule.startedAt && (
                    <div className="mr-2">
                      <RedButton
                        disableElevation
                        startIcon={<CloseCircleOutline />}
                        variant="contained"
                        onClick={() => setDialog('cancel')}>
                        {formatMessage({ id: 'scheduleDetails.button.cancel' })}
                      </RedButton>
                    </div>
                  )}
                  {schedule.professional.uuid === currentUser?.uuid && (
                    <div>
                      {!schedule.startedAt ? (
                        <Button
                          disableElevation
                          variant="contained"
                          color="primary"
                          onClick={handleMeetStart}>
                          <FormattedMessage id="jitsiMeet.button.start" />
                        </Button>
                      ) : (
                        <Button
                          disableElevation
                          startIcon={<CheckAll />}
                          variant="contained"
                          color="primary"
                          onClick={() => setDialog('finish')}>
                          {formatMessage({
                            id: 'scheduleDetails.button.finish',
                          })}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <ScheduleStatus schedule={schedule} />

              <div>
                <DataSummary
                  title={formatMessage({ id: 'scheduleDetails.professional' })}
                  left={<Avatar src={schedule.professional.avatar} />}
                  description={schedule.professional.name}
                  linkTo={`/professional/profile/${schedule.professional.uuid}`}
                  linkLabel={formatMessage({
                    id: 'scheduleDetails.viewProfile',
                  })}
                />

                <DataSummary
                  title={formatMessage({ id: 'scheduleDetails.patient' })}
                  left={<Avatar src={schedule.patient.avatar} />}
                  description={schedule.patient.name}
                  linkTo={`/patient/profile/${schedule.patient.uuid}`}
                  linkLabel={formatMessage({
                    id: 'scheduleDetails.viewProfile',
                  })}
                />

                {schedule.status === ScheduleStatuses.confirmed && (
                  <DataSummary
                    title={formatMessage({
                      id: 'scheduleDetails.onlineFulfillment',
                    })}
                    left={<Alarm />}
                    description={startingAtLabel}
                    linkTo={`/schedule/${schedule.uuid}/meet`}
                    linkLabel={formatMessage({
                      id: 'scheduleDetails.joinMeet',
                    })}
                  />
                )}
              </div>

              <CancelScheduleDialog
                open={dialog === 'cancel'}
                schedule={schedule}
                onClose={() => setDialog(null)}
                onComplete={() => {
                  setDialog(null);
                  find(schedule.uuid);
                }}
              />

              <FinishScheduleDialog
                open={dialog === 'finish'}
                schedule={schedule}
                onClose={() => setDialog(null)}
                onComplete={() => {
                  setDialog(null);
                  find(schedule.uuid);
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={4} lg={5}>
            <OrderSummary
              professional={schedule.professional}
              startingAt={schedule.startingAt}
              endingAt={schedule.endingAt}
              total={schedule.chargedValue}
            />

            <div className="bg-white">
              <div className="p-2 lg:px-8 pb-8 ">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="mb-1">
                    <Typography variant="caption">
                      {formatMessage({ id: 'scheduleDetails.paymentStatus' })}
                    </Typography>
                  </div>
                  <div>
                    <PaymentStatusChip status={schedule.paymentStatus} />
                  </div>
                </div>
              </div>

              {displayCheckoutButton && (
                <div className="self-end">
                  <Button
                    component={Link}
                    to={`/checkout?schedule=${schedule.uuid}`}
                    endIcon={<OpenInNew />}
                    variant="contained"
                    fullWidth
                    size="large"
                    disableElevation
                    className={styles.submitButton}
                    color="primary">
                    {formatMessage({ id: 'scheduleDetails.checkout' })}
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </LoadingContainer>
  );
};

interface ScheduleStatusProps {
  schedule: ISchedule;
}

const ScheduleStatus = (props: ScheduleStatusProps) => {
  const { formatMessage } = useIntl();

  if (props.schedule.status === ScheduleStatuses.inactive) {
    if (!props.schedule.cancelledAt) return null;

    return (
      <div className="bg-red-50 rounded-lg p-4 mb-8">
        <Box color="error.main">
          <div className="flex items-center mb-2">
            <AlertOutline color="inherit" />
            <div className="ml-2">
              <Typography>
                <b>
                  {formatMessage({
                    id: 'scheduleDetails.cancellingReason.title',
                  })}
                </b>
              </Typography>
            </div>
          </div>
        </Box>
        <Typography>
          <b>
            {formatMessage({
              id: 'scheduleDetails.cancellingReason.description',
            })}
          </b>
          {props.schedule.cancellingReason}
        </Typography>

        <Typography>
          <b>
            {formatMessage({
              id: 'scheduleDetails.cancellingReason.date',
            })}
          </b>
          {Moment(props.schedule.cancelledAt).format('DD/MM/YYYY [às] HH:mm')}
        </Typography>

        {props.schedule.cancelledBy && (
          <Typography>
            <b>
              {formatMessage({
                id: 'scheduleDetails.cancellingReason.cancelledBy',
              })}
            </b>
            {props.schedule.cancelledBy.name}
          </Typography>
        )}
      </div>
    );
  }

  return null;
};
