import FullCalendar from '@fullcalendar/react';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import listPlugin from '@fullcalendar/list';
import { Button, Tooltip, Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Cog, ForumOutline } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import { ProfessionalApi } from '../../apis';
import { ScheduleApi } from '../../apis/ScheduleApi';
import {
  BoxWrapperDashboard,
  ItemDTO,
  RejectProfessionalDialog,
  SubMenuDashboard,
  TitleDashboard,
} from '../../components';
import { ApproveProfessional } from '../../components/Dialogs/ApproveProfessional';
import useAuth from '../../hooks/useAuth';
import { IProfessional, ISchedule } from '../../libs';
import FinancialReceipts from '../Financial/FinancialReceipts/FinancialReceipts';
import { ConfigureBankAccount } from './ConfigureBankAccount/ConfigureBankAccount';
import ConfigureScheduleCalendar from './ConfigureScheduleCalendar/ConfigureScheduleCalendar';
import EditProfessionalProfile from './EditProfessionalProfile';
import ViewProfessionalProfile from './ViewProfessionalProfile';

interface ProfessionalProfileParams {
  uuid: string;
}

type Dialogs = 'approve' | 'reject' | null;

export const ProfessionalProfile: React.FC<
  RouteComponentProps<ProfessionalProfileParams>
> = (props) => {
  const Intl = useIntl();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('perfil');
  const [dialog, setOpenDialog] = useState<Dialogs>(null);
  const [schedule, setSchedule] = useState<any>([]);
  const [items, setItems] = useState<ItemDTO[]>([]);
  const { currentUser } = useAuth();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableHours, setAvailableHours] = useState<string[] | null>(null);
  const [startingAt, setStartingAt] = useState<Date>();
  const [endingAt, setEndingAt] = useState<Date>();
  const [availableHourSelect, setAvailableHourSelect] = useState<string>('');
  const [user, setUser] = useState<IProfessional>({
    uuid: '',
    name: '',
    avatar: '',
    crm: '',
    crmState: 'MG',
    crp: '',
    crpState: 'MG',
    email: '',
    actAs: [],
    charges: 0,
    sessionDuration: 0,
    birthDate: null,
    documentNumber: '',
    showWhatsapp: false,
    worksWith: [],

    expertises: [],
    education: [],

    aboutMe: '',

    rejectionReason: null,

    status: 'incomplete',
    workingSchedule: {},
    user: {
      email: '',
      lastSignInAt: new Date(),
      name: '',
      status: '',
      type: '',
      uuid: '',
    },
  });

  const handlerShowEvent = useCallback(async ({ event }) => {
    const data = event.extendedProps.extraParams;
    window.location.href = `/schedule/${data.uuid}`;
  }, []);

  const getDateSchedule = useCallback(
    async (options: { from: string; until: string }) => {
      const data = await ScheduleApi.listDateAvailable({
        professional: props.match.params.uuid,

        from: options.from,
        until: options.until,
      });
      setAvailableDates(data.days.map((item) => new Date(item)));
    },
    [setAvailableDates],
  );

  const getHourSchedule = useCallback(
    async (dateSelect: Date) => {
      const data = await ScheduleApi.listHoursAvailable({
        uuid: props.match.params.uuid,
        dateSelect,
      });
      setAvailableHours(data.hours);
      setStartingAt(new Date(dateSelect));
      setEndingAt(new Date(dateSelect));
    },
    [setAvailableHours, setStartingAt, setEndingAt],
  );

  const handleSetHour = useCallback(
    async (time: string) => {
      const [hour, minutes] = time.split(':');
      const startingAttemp = startingAt;

      startingAttemp?.setHours(Number(hour), Number(minutes));
      setStartingAt(new Date(startingAttemp as Date));
      setEndingAt(new Date(startingAttemp as Date));
      setAvailableHourSelect(time);
    },
    [setAvailableHourSelect, setStartingAt, startingAt],
  );

  const handleCheckout = useCallback(async () => {
    endingAt?.setHours(endingAt?.getHours(), endingAt?.getMinutes() + 50);

    window.location.href = `/checkout?startingAt=${moment(
      startingAt,
    ).toISOString(true)}&endingAt=${moment(endingAt).toISOString(
      true,
    )}&professional=${props.match.params.uuid}`;
  }, [startingAt, endingAt]);

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

  const getProfessional = useCallback(async () => {
    if (!currentUser) return;

    let { uuid } = currentUser;

    // view admin and patient
    if (props && props.match.params.uuid) {
      uuid = props.match.params.uuid;

      if (currentUser?.type === 'admin') {
        console.log('items', items);
        setItems([
          {
            label: 'Perfil',
            name: 'perfil',
            handler: () => {
              setEdit(false);
              setActiveTab('perfil');
            },
          },
          {
            label: 'Financeiro',
            name: 'finance',
            handler: () => {
              setEdit(false);
              setActiveTab('finance');
            },
          },
        ]);
      }
    } else {
      // view professional
      setItems([
        {
          label: 'Perfil',
          name: 'perfil',
          handler: () => {
            setEdit(false);
            setActiveTab('perfil');
          },
        },
        {
          label: 'Conta Bancária',
          name: 'bankAccount',
          handler: () => {
            setActiveTab('bankAccount');
          },
        },
        {
          label: 'Financeiro',
          name: 'finance',
          handler: () => {
            setEdit(false);
            setActiveTab('finance');
          },
        },
      ]);
    }

    if (uuid) {
      const professional = await ProfessionalApi.show(uuid, {
        ignoreObjectNotFound: uuid === currentUser.uuid,
      });

      // professional without profile
      if (!professional) {
        setEdit(true);
        setActiveTab('perfil');
      } else {
        setUser(professional);
      }

      if (currentUser?.type !== 'patient') {
        const from = new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay()),
        );
        const until = new Date(
          new Date().setDate(new Date().getDate() + (6 - new Date().getDay())),
        );
        const scheduleTemp = await ScheduleApi.list({
          page: 1,
          pageSize: 100,
          professional: uuid,
          from,
          until,
        });

        setSchedule(
          scheduleTemp.map((row: ISchedule) => {
            return {
              id: row.uuid,
              title: `${row.patient.name}`,
              extraParams: row,
              display: true,
              textColor: getTextColor(row),
              backgroundColor: getBackgroundColor(row.status),
              start: moment(row.startingAt).format(),
              end: moment(row.endingAt).format(),
            };
          }),
        );
      }
    }
  }, [props, currentUser]);

  const openDialogApprove = useCallback(() => {
    setOpenDialog('approve');
  }, []);

  const handlerSuccessDialog = useCallback(async (uuid: string) => {
    await ProfessionalApi.alterStatus(uuid, 'verified')
      .then(() => {
        toast.success(
          Intl.formatMessage({ id: 'api.profissional.approve.success' }),
        );
      })
      .catch((err) => {
        toast.error(
          Intl.formatMessage({ id: 'api.profissional.approve.error' }),
        );
      })
      .finally(() => {
        setOpenDialog(null);
      });
  }, []);

  const handlerCloseDialog = useCallback(() => {
    setOpenDialog(null);
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  useEffect(() => {
    getProfessional();
    if (currentUser?.type === 'patient')
      getDateSchedule({
        from: moment().toISOString(true),
        until: moment().endOf('month').toISOString(true),
      });
    if (currentUser?.type === 'admin') setIsAdmin(true);
  }, [currentUser]);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="professionalProfile.title" />
        {user.status === 'waiting' && isAdmin && (
          <>
            <div>
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                size="large"
                onClick={() => setOpenDialog('reject')}
                style={{ marginRight: 16 }}>
                <FormattedMessage id="professionalProfile.button.reject" />
              </Button>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                size="large"
                onClick={openDialogApprove}>
                <FormattedMessage id="professionalProfile.button.approve" />
              </Button>
            </div>
            <RejectProfessionalDialog
              professional={user}
              open={dialog === 'reject'}
              onClose={() => setOpenDialog(null)}
              onComplete={() => {
                window.location.reload();
                setOpenDialog(null);
              }}
            />
            <ApproveProfessional
              professional={user}
              isOpen={dialog === 'approve'}
              handlerCloseDialog={handlerCloseDialog}
              handlerSuccessDialog={() => handlerSuccessDialog(user.uuid)}
            />
          </>
        )}
      </TitleDashboard>

      {items.length !== 0 ? (
        <SubMenuDashboard items={items} activeTab={activeTab} />
      ) : (
        <div className="mb-8" />
      )}
      <BoxWrapperDashboard>
        <section
          id="professional"
          className="h-full bg-white  divide-y divide-gray-300 rounded w-11/12 xl:mx-8 xl:w-8/12">
          {activeTab === 'perfil' && user && !edit && (
            <ViewProfessionalProfile
              user={{
                ...user,
                uuid: props.match.params.uuid || currentUser?.uuid || '',
              }}
              onEdit={() => {
                setEdit(true);
                setActiveTab('perfil');
              }}
            />
          )}
          {activeTab === 'perfil' && edit && (
            <EditProfessionalProfile
              user={user}
              onComplete={() => {
                setEdit(false);
                getProfessional();
              }}
            />
          )}
          {activeTab === 'finance' && (
            <FinancialReceipts uuidUser={props.match.params.uuid} />
          )}
          {activeTab === 'bankAccount' && (
            <ConfigureBankAccount readonly={!edit} />
          )}
        </section>
        {currentUser?.type === 'patient' && (
          <section className="flex flex-col w-full ml-8">
            {availableDates.length === 0 && (
              <h3 className="text-red-500 text-base mt-6 text-center">
                Professional não possui horários disponíveis
              </h3>
            )}
            <div className="w-11/12">
              <h3 className="text-primary text-base mt-6">
                selecione uma data
              </h3>
              <Calendar
                className="w-full"
                nextLabel={<ChevronRight />}
                next2Label={null}
                prevLabel={<ChevronLeft />}
                prev2Label={null}
                minDate={moment().add(24, 'hours').toDate()}
                tileDisabled={({ date, view }) => {
                  const checkDate = availableDates.some((availableDate) => {
                    return (
                      date.getFullYear() === availableDate.getFullYear() &&
                      date.getMonth() === availableDate.getMonth() &&
                      date.getDate() === availableDate.getDate() + 1
                    );
                  });
                  return !checkDate && view === 'month';
                }}
                onActiveStartDateChange={(value) => {
                  if (value.view === 'month') {
                    getDateSchedule({
                      from: moment(value.activeStartDate).toISOString(true),
                      until: moment(value.activeStartDate)
                        .endOf('month')
                        .toISOString(true),
                    });
                  }
                }}
                onChange={(dateSelect) => {
                  getHourSchedule(dateSelect as Date);
                }}
              />
            </div>

            {availableHours && (
              <div className="bg-white w-11/12">
                <h3 className="text-primary ml-4 text-base mt-6">
                  selecione um horário
                </h3>
                <div className="flex flex-wrap  mt-2 mb-6 rounded justify-center gap-1">
                  {availableHours.map((availableHour) => (
                    <p
                      className={`p-2 rounded border-2 border-primary items-center bg-white text-center cursor-pointer ${
                        availableHour === availableHourSelect &&
                        'bg-primary text-white border-white'
                      } `}
                      onClick={() => handleSetHour(availableHour)}
                      key={availableHour}>
                      {availableHour}
                    </p>
                  ))}
                </div>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleCheckout();
                  }}
                  color="primary">
                  {Intl.formatMessage({ id: 'button.advance' })}
                </Button>
              </div>
            )}

            <div
              className="w-11/12 mt-4 rounded-md border-2 p-4"
              style={{ borderColor: '#00B0AB' }}>
              <Typography gutterBottom>
                <b>
                  Para agendar com menos de 24h de antecedência, entre em
                  contato diretamente com o profissional
                </b>
              </Typography>

              <Button
                variant="contained"
                disableElevation
                color="primary"
                component={Link}
                to={`/chat?to=${user.uuid}&name=${user.name}&type=professional`}
                startIcon={<ForumOutline />}>
                Iniciar Conversa no Chat
              </Button>
            </div>
          </section>
        )}
        {currentUser?.type !== 'patient' && (
          <section
            className="w-11/12 h-full bg-white rounded mt-6 xl:w-4/12 xl:mt-0 xl:mr-8"
            id="calendar">
            <h2 className="font-bold text-sm m-3.5">
              <FormattedMessage id="professionalProfile.listWeek" />
            </h2>
            <div className="w-full text-xs md:text-sm px-5 pb-5">
              <FullCalendar
                plugins={[listPlugin]}
                locale="pt-br"
                locales={[ptbrLocale]}
                headerToolbar={{
                  left: 'title',
                  right: '',
                }}
                initialView="listWeek"
                editable={false}
                selectable
                selectMirror
                initialEvents={{}}
                dayMaxEvents
                weekends
                events={schedule}
                eventClick={handlerShowEvent}
              />
            </div>
            {!props.match.params.uuid && (
              <Tooltip
                title={
                  !user.uuid ? (
                    <FormattedMessage id="professionalProfile.beforeSettingWorkingSchedule" />
                  ) : (
                    ''
                  )
                }>
                <div>
                  <Button
                    onClick={() => setModalIsOpen(true)}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disableElevation
                    disabled={!user.uuid}
                    startIcon={<Cog fontSize="small" className="mr-2" />}
                    style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <FormattedMessage id="professionalProfile.button.editWeekCalendar" />
                  </Button>
                </div>
              </Tooltip>
            )}

            <ConfigureScheduleCalendar
              open={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
              user={user}
            />
          </section>
        )}
      </BoxWrapperDashboard>
    </section>
  );
};
