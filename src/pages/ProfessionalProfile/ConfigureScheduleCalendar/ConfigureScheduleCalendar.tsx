import {
  Backdrop,
  Button,
  Checkbox,
  createStyles,
  Divider,
  Fade,
  FormControlLabel,
  makeStyles,
  Modal,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import { Close } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { WorkingScheduleApi } from '../../../apis/WorkingScheduleApi';
import { IProfessional } from '../../../libs';
import { IDayOfWeek } from '../../../libs/IDayOfWeek';
import { IHourOfDay } from '../../../libs/IHourOfDay';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

const baseStyle =
  'inline-block p-2 rounded text-center cursor-pointer focus:outline-none';

const activeHourStyle = `${baseStyle} bg-primary text-white`;
const inactiveHourStyle = `${baseStyle} text-gray-500 bg-gray-300 opacity-40`;

interface IHourDayHandleChange {
  selectedDay: string;
  selectedHour: IHourOfDay;
}

const getHoursInDay = (): Array<IHourOfDay> => {
  let hours: Array<IHourOfDay> = [];

  for (let i = 1; i <= 24; i += 1) {
    let hour;
    if (i === 24) {
      hour = `00:00`;
    } else if (i > 9) {
      hour = `${i}:00`;
    } else {
      hour = `0${i}:00`;
    }
    hours = [...hours, { value: hour, selected: false }];
  }

  return hours;
};

const ConfigureScheduleCalendar: React.FC<{
  user: IProfessional;
  open: boolean;
  onClose: () => void;
}> = ({ user, open, onClose }) => {
  const classes = useStyles();
  const Intl = useIntl();
  const [daysOfWeek, setDaysOfWeek] = useState<IDayOfWeek>({});

  const verifyIfDayIsSelected = useCallback((hours: Array<IHourOfDay>) => {
    hours = hours || getHoursInDay();

    const totalHoursLen = hours.length;
    let totalHoursSelected = 0;

    hours.map((hour) => {
      if (hour.selected === true) totalHoursSelected += 1;
      return hour;
    });

    return totalHoursLen === totalHoursSelected;
  }, []);

  useEffect(() => {
    setDaysOfWeek({
      monday: {
        label: 'SEG',
        selected: verifyIfDayIsSelected(user.workingSchedule?.monday?.hours),
        hours: user.workingSchedule?.monday?.hours
          ? user.workingSchedule?.monday?.hours
          : getHoursInDay(),
      },
      tuesday: {
        label: 'TER',
        selected: verifyIfDayIsSelected(user.workingSchedule?.tuesday?.hours),
        hours: user.workingSchedule?.tuesday?.hours
          ? user.workingSchedule?.tuesday?.hours
          : getHoursInDay(),
      },
      wednesday: {
        label: 'QUA',
        selected: verifyIfDayIsSelected(user.workingSchedule?.wednesday?.hours),
        hours: user.workingSchedule?.wednesday?.hours
          ? user.workingSchedule?.wednesday?.hours
          : getHoursInDay(),
      },
      thursday: {
        label: 'QUI',
        selected: verifyIfDayIsSelected(user.workingSchedule?.thursday?.hours),
        hours: user.workingSchedule?.thursday?.hours
          ? user.workingSchedule?.thursday?.hours
          : getHoursInDay(),
      },
      friday: {
        label: 'SEX',
        selected: verifyIfDayIsSelected(user.workingSchedule?.friday?.hours),
        hours: user.workingSchedule?.friday?.hours
          ? user.workingSchedule?.friday?.hours
          : getHoursInDay(),
      },
      saturday: {
        label: 'SAB',
        selected: verifyIfDayIsSelected(user.workingSchedule?.saturday?.hours),
        hours: user.workingSchedule?.saturday?.hours
          ? user.workingSchedule?.saturday?.hours
          : getHoursInDay(),
      },
      sunday: {
        label: 'DOM',
        selected: verifyIfDayIsSelected(user.workingSchedule?.sunday?.hours),
        hours: user.workingSchedule?.sunday?.hours
          ? user.workingSchedule?.sunday?.hours
          : getHoursInDay(),
      },
    });
  }, [user]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const dayHandleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const targetName = event.target.name;
      const targetIsselected = event.target.checked;

      console.log(
        'daysOfWeek',
        daysOfWeek,
        'targetName',
        targetName,
        'targetIsselected',
        targetIsselected,
      );

      const hours = daysOfWeek[targetName].hours.map((hour) => {
        hour.selected = targetIsselected;
        return hour;
      });

      setDaysOfWeek({
        ...daysOfWeek,
        [targetName]: {
          ...daysOfWeek[targetName],
          ...hours,
          selected: targetIsselected,
        },
      });
    },
    [daysOfWeek],
  );

  const hourDayHandleChange = useCallback(
    ({ selectedDay, selectedHour }: IHourDayHandleChange) => {
      const hours = daysOfWeek[selectedDay].hours.map((hour) => {
        if (hour.value === selectedHour.value) {
          hour.selected = !hour.selected;
        }
        return hour;
      });

      setDaysOfWeek({
        ...daysOfWeek,
        [selectedDay]: {
          ...daysOfWeek[selectedDay],
          hours,
        },
      });
    },
    [daysOfWeek],
  );

  const handlerSubmit = useCallback(async () => {
    await WorkingScheduleApi.alter(daysOfWeek)
      .then(() => {
        window.location.reload();

        toast.success(
          Intl.formatMessage({
            id: 'api.configureSchduleCalendar.update.success',
          }),
        );
      })
      .catch(() => {
        toast.error(
          Intl.formatMessage({
            id: 'api.configureSchduleCalendar.update.error',
          }),
        );
      });
  }, [daysOfWeek]);

  return (
    <Modal
      open={open}
      className={classes.modal}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={open}>
        <section className="w-9/12 h-5/6 bg-white rounded focus:outline-none overflow-y-hidden">
          <section className="flex items-center justify-between h-1/6 w-full px-8 ">
            <strong className="text-lg leading-7">
              Configurar Horários da Agenda
            </strong>
            <Close
              className="text-gray-500"
              cursor="pointer"
              onClick={onClose}
            />
          </section>
          <Divider />
          <section className="h-4/6 flex overflow-auto mx-4 gap-1">
            {Object.keys(daysOfWeek).map((key) => (
              <div className="flex flex-col w-44" key={key}>
                <FormControlLabel
                  key={key}
                  value={key}
                  control={
                    <Checkbox
                      checked={daysOfWeek[key].selected}
                      color="primary"
                      name={key}
                      onChange={dayHandleChange}
                    />
                  }
                  label={daysOfWeek[key].label}
                  labelPlacement="end"
                />
                <div className="flex flex-col gap-2">
                  {daysOfWeek[key].hours &&
                    daysOfWeek[key].hours.map((hour) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() =>
                          hourDayHandleChange({
                            selectedDay: key,
                            selectedHour: hour,
                          })
                        }
                        className={
                          hour.selected ? activeHourStyle : inactiveHourStyle
                        }>
                        <strong className="text-xs ">{hour.value}</strong>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </section>
          <Divider />
          <section className="flex items-center justify-end w-full h-1/6 gap-6 px-8">
            <Button
              className="focus:outline-none"
              color="primary"
              onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="focus:outline-none"
              variant="contained"
              color="primary"
              onClick={handlerSubmit}>
              Confirmar
            </Button>
          </section>
        </section>
      </Fade>
    </Modal>
  );
};

export default ConfigureScheduleCalendar;
