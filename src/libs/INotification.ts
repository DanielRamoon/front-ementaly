import { Moment } from 'moment';

export interface INotification {
  uuid: string;
  title: string;
  description: string;

  createdAt: Moment;
}
