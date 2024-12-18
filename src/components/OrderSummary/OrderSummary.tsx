import { Avatar, Divider, Typography } from '@material-ui/core';
import {
  BellOutline,
  CalendarBlankOutline,
  ClockOutline,
} from 'mdi-material-ui';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';

import { IProfessional } from '../../libs';
import { getProfessionalCertification } from '../../utils/getProfessionalCertification';

interface OrderSummaryProps {
  professional: IProfessional;

  startingAt: string;
  endingAt: string;
  total: number;
}

export const OrderSummary = (props: OrderSummaryProps) => {
  const [labels, setLabels] = useState({
    date: '',
    startingAt: '',
    endingAt: '',
    duration: 0,
  });

  useEffect(() => {
    const startingAt = Moment(props.startingAt);
    const endingAt = Moment(props.endingAt);

    setLabels((prev) => {
      return {
        ...prev,
        date: startingAt.format('ddd, DD [de] MMMM [de] YYYY'),
        startingAt: startingAt.format('HH:mm'),
        endingAt: endingAt.format('HH:mm'),

        duration: Math.abs(startingAt.diff(endingAt, 'minutes')),
      };
    });
  }, [props.startingAt, props.endingAt]);

  return (
    <div>
      <div className="bg-white p-2 lg:p-8">
        {props.professional && (
          <div className="flex mb-8">
            <div className="mr-4">
              <Avatar
                src={props.professional.avatar}
                style={{ width: 64, height: 64 }}
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <Typography>
                  <b>{props.professional.name}</b>
                </Typography>
                <Typography>
                  {getProfessionalCertification(props.professional)}
                </Typography>
              </div>

              <div className="flex flex-wrap">
                {(props.professional.expertises || []).map((expertise) => {
                  return (
                    <div
                      className="border-2 border-solid border-gray-200 rounded p-2 mr-1 mb-1 text-xs "
                      key={expertise.uuid}>
                      {expertise.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div>
          <Divider />
        </div>

        <div className="my-8">
          <div className="flex items-center mb-3">
            <CalendarBlankOutline className="mr-2" />
            <Typography>{labels.date}</Typography>
          </div>

          <div className="flex items-center mb-3">
            <ClockOutline className="mr-2" />
            <Typography>
              {labels.startingAt} - {labels.endingAt}
            </Typography>
          </div>

          <div className="flex items-center mb-3">
            <BellOutline className="mr-2" />
            <Typography>{labels.duration} minutos</Typography>
          </div>
        </div>

        <div>
          <Divider />
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <Typography variant="h6">
              <b>Total</b>
            </Typography>

            <Typography variant="h6">
              <b>
                {props.total.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </b>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
