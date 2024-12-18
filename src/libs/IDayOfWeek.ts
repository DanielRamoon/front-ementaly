import { IHourOfDay } from './IHourOfDay';

export interface IDayOfWeek {
  [any: string]: {
    label: string;
    selected: boolean;
    hours: Array<IHourOfDay>;
  };
}
