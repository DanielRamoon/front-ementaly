import { Divider } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from 'mdi-material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import ReactGA from 'react-ga4';

import { ScheduleApi } from '../../apis';
import { LoadingContainer, TitleDashboard } from '../../components';
import { ISchedule, ScheduleQueryDTO } from '../../libs';
import { ScheduleItem } from './ScheduleItem';

interface ListSchedulesProps {}

export const ListSchedules: React.FC<ListSchedulesProps> = (props) => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const lastIndex = React.useRef(0);
  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const find = async (options: ScheduleQueryDTO): Promise<void> => {
    try {
      setLoading(true);

      const data = await ScheduleApi.find({
        ...options,
      });

      lastIndex.current = data.length - 1;

      setSchedules(data);
    } catch {
      // TODO display error msg
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    find({
      from: moment().startOf('month').toISOString(true),
      until: moment().endOf('month').toISOString(true),
      page,
      pageSize: 25,
    });
  }, [page]);

  return (
    <section className="p-2 md:p-8 lg:flex">
      <div className=" bg-white lg:w-2/3  mr-8">
        <TitleDashboard>Agenda</TitleDashboard>
        <div className="p-6">
          <LoadingContainer loading={isLoading}>
            {schedules.map((schedule, index) => {
              return (
                <div key={`schedule-${schedule.uuid}`}>
                  <ScheduleItem schedule={schedule} />

                  {index !== lastIndex.current && (
                    <div className="my-8">
                      <Divider />
                    </div>
                  )}
                </div>
              );
            })}
          </LoadingContainer>
        </div>
      </div>

      <div className="lg:w-1/3">
        <Calendar
          className="w-96"
          nextLabel={<ChevronRight />}
          next2Label={null}
          prevLabel={<ChevronLeft />}
          prev2Label={null}
          onActiveStartDateChange={(value) => {
            if (value.view === 'month') {
              find({
                from: moment(value.activeStartDate)
                  .startOf('month')
                  .toISOString(true),
                until: moment(value.activeStartDate)
                  .endOf('month')
                  .toISOString(true),
                page,
                pageSize: 25,
              });
            }
          }}
          onChange={(value) => {
            if (Array.isArray(value)) {
              console.log('Value: ', value);

              return;
            }

            find({
              from: moment(value).startOf('day').toISOString(true),
              until: moment(value).endOf('day').toISOString(true),
              page,
              pageSize: 25,
            });
          }}
        />
      </div>
    </section>
  );
};
