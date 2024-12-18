import Moment from 'moment';

export function joinDateAndTime(
  dateStr: string,
  timeStr: string,
): Moment.Moment {
  const date = Moment(dateStr);
  const time = Moment(timeStr);

  return date.set('hour', time.hours()).set('minutes', time.minutes());
}
