import React from 'react';
import { ChevronRight, ChevronLeft } from 'mdi-material-ui';
import { RouteComponentProps } from 'react-router-dom';
import { IProfessional } from '../../libs';

const getDayWeek = (moreDay: number): string => {
  const date = new Date().setDate(new Date().getDate() + moreDay);
  const day = new Date(date).getDay();

  switch (day) {
    case 1:
      return 'SEG';
    case 2:
      return 'TER';
    case 3:
      return 'QUA';
    case 4:
      return 'QUI';
    case 5:
      return 'SEX';
    case 6:
      return 'SAB';
    case 0:
      return 'DOM';
    default:
      return '';
  }
};

const getDate = (moreDay: number): string => {
  const date = new Date(new Date().setDate(new Date().getDate() + moreDay));
  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
};

const weekDays = [
  {
    dayWeek: getDayWeek(0),
    date: getDate(0),
  },
  {
    dayWeek: getDayWeek(1),
    date: getDate(1),
  },
  {
    dayWeek: getDayWeek(2),
    date: getDate(2),
  },
  {
    dayWeek: getDayWeek(3),
    date: getDate(3),
  },
];

const hours = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

interface CalendarWeekParams {
  user: IProfessional;
}

export const CalendarWeek: React.FC<CalendarWeekParams> = ({ user }) => {
  console.log({ user });
  return (
    <section>
      <div className="flex w-full justify-around border-gray-300 border-b-2 border-solid py-2">
        <ChevronLeft className="cursor-pointer" />

        {weekDays.map((day) => (
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs">{day.dayWeek}</h4>
            <h6 className="text-xs text-gray-600">{day.date}</h6>
          </div>
        ))}
        <ChevronRight className="cursor-pointer" />
      </div>
      <div className="flex justify-center m-3 max-h-56 overflow-auto">
        {weekDays.map(() => (
          <div className="flex flex-col items-center w-1/6 xl:w-1/5">
            {hours.map((hour) => (
              <span className="bg-gray-200 font-bold text-xs  m-1 w-24 rounded text-center py-1 px-2 text-gray-700 xl:w-12 ">
                {hour}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
