import { Avatar, ButtonBase, Typography } from '@material-ui/core';
import {
  Autorenew,
  CalendarRangeOutline,
  MapMarkerOutline,
} from 'mdi-material-ui';
import Moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { PaymentStatusChip } from '../../components';
import useAuth from '../../hooks/useAuth';
import { ISchedule } from '../../libs';

interface ScheduleItemProps {
  schedule: ISchedule;
}

export const ScheduleItem: React.FC<ScheduleItemProps> = (props) => {
  const { current: startingAt } = useRef(Moment(props.schedule.startingAt));
  const { current: endingAt } = useRef(Moment(props.schedule.endingAt));

  const intl = useIntl();
  const { formatMessage } = intl;

  const { currentUser } = useAuth();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const data =
    currentUser?.type === 'patient'
      ? props.schedule.professional
      : props.schedule.patient;

  return (
    <ButtonBase
      component={Link}
      to={`/schedule/${props.schedule.uuid}`}
      style={{ justifyContent: 'flex-start', width: '100%' }}>
      <div className="w-full">
        <div className="lg:flex">
          <div className="flex-1 flex items-center mb-8">
            <Avatar src={data.avatar} style={{ marginRight: 16 }} />
            <Typography variant="h6">
              <b>{data.name}</b>
            </Typography>
          </div>
        </div>

        <div className="lg:flex">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <CalendarRangeOutline style={{ marginRight: 8 }} />
              <Typography>
                {startingAt.format(
                  intl.formatMessage({ id: 'scheduleItem.startingAt.format' }),
                )}{' '}
                {endingAt.format(
                  intl.formatMessage({ id: 'scheduleItem.endingAt.format' }),
                )}
              </Typography>
            </div>
            <div className="mb-4">
              <PaymentStatusChip status={props.schedule.paymentStatus} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center mb-4">
              <Autorenew style={{ marginRight: 8 }} />
              <Typography>
                {!props.schedule.recurrence
                  ? formatMessage({ id: 'scheduleItem.recurrence.single' })
                  : formatMessage(
                      { id: 'scheduleItem.recurrence.multiple' },
                      {
                        recurrence: props.schedule.recurrence,
                        recurrenceUntil: Moment(
                          props.schedule.recurrenceUntil,
                        ).format('DD/MM/YYYY'),
                      },
                    )}
              </Typography>
            </div>
            <div className="flex items-center mb-4">
              <MapMarkerOutline style={{ marginRight: 8 }} />
              <Typography>
                {intl.formatMessage({ id: 'scheduleItem.fulfillment.online' })}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </ButtonBase>
  );
};
