import { useHistory } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactGA from 'react-ga4';

import { ScheduleApi } from '../../apis/ScheduleApi';
import { BoxWrapperDashboard, TitleDashboard } from '../../components';
import useAuth from '../../hooks/useAuth';
import { IResource, ISchedule } from '../../libs';

import { CreateScheduleDialog } from '../../components/CreateScheduleDialog/CreateScheduleDialog';

export const ProfessionalSchedule: React.FC = () => {
  const history = useHistory();
  const [schedule, setSchedule] = useState<any>([]);
  const [showScheduleModal, setshowScheduleModal] = useState(false);
  const [dateToSchedule, setDateToSchedule] = useState<string | null>(null);

  const Intl = useIntl();
  const { currentUser } = useAuth();
  const legends = ['active', 'inactive', 'confirmed', 'completed'];
  // active: Aguardando Pagto
  // inactive: Cancelado
  // confirmed: Agendamento Confirmado (pagamento realizado)
  // completed: Agendamento concluído
  function getTextColor(row: ISchedule): string {
    switch (row.status) {
      case 'completed':
        return '#fff';
      case 'inactive':
        return '#fff';
      default:
        return '#444';
    }
  }

  function getBackgroundColor(status: string): string {
    switch (status) {
      case 'active':
        return '#FADD52';
      case 'inactive':
        return '#fa5252';
      case 'confirmed':
        return '#00B0AB';
      case 'completed':
        return '#03615e';
      default:
        return '#ccc';
    }
  }

  const getSchedule = useCallback(async () => {
    if (!currentUser) return;

    const { uuid } = currentUser;
    // FIX-ME : Foi mal, apenas resolva depois, obrigado
    // A gerencia
    const scheduleTemp = await ScheduleApi.list({
      page: 1,
      pageSize: 500,
      professional: uuid,
    });

    setSchedule(
      scheduleTemp.map((row: ISchedule) => {
        return {
          id: row.uuid,
          title: `${row.patient.name.split(' ')[0]}`,
          description: `${row.patient.name}`,
          extraParams: row,
          textColor: getTextColor(row),
          backgroundColor: getBackgroundColor(row.status),
          start: moment(new Date(row.startingAt)).format(),
          end: moment(new Date(row.endingAt)).format(),
        };
      }),
    );
  }, []);

  const handlerDateClick = (params: DateClickArg) => {
    if (params.date.getTime() < new Date().getTime()) return;
    setshowScheduleModal(true);
    console.log(params);
  };

  const handlerShowEvent = useCallback(async ({ event }) => {
    const data = event.extendedProps.extraParams;
    window.location.href = `/schedule/${data.uuid}`;
  }, []);

  useEffect(() => {
    getSchedule();
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section className="h-full">
      <CreateScheduleDialog
        open={showScheduleModal}
        onClose={() => setshowScheduleModal(false)}
        onComplete={(scheduleData) => {
          setshowScheduleModal(false);
          history.push(`/schedule/${scheduleData.uuid}`);
        }}
      />
      <TitleDashboard>
        <FormattedMessage id="professionalSchedule.title" />
      </TitleDashboard>
      <BoxWrapperDashboard>
        <div className=" w-11/12 h-full mx-auto mt-6 bg-white text-xs md:text-base">
          <section className="flex flex-row my-4 ">
            {legends.map((status, index) => (
              <div className="flex items-center mr-2" key={`${status}`}>
                <span
                  style={{ backgroundColor: getBackgroundColor(status) }}
                  className="w-2 h-2 inline-block mr-1"
                />
                <p>
                  <FormattedMessage
                    id={`professionalSchedule.legends.${status}`}
                  />
                </p>
              </div>
            ))}
          </section>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            locale="pt-br"
            locales={[ptbrLocale]}
            buttonText={{
              list: Intl.formatMessage({ id: 'professionalSchedule.history' }),
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable
            initialEvents={{}}
            dateClick={handlerDateClick}
            events={schedule}
            eventClick={handlerShowEvent}
          />
        </div>
      </BoxWrapperDashboard>
    </section>
  );
};
