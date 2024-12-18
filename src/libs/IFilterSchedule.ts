export interface IFilterSchedule {
  page: number;
  pageSize: number;
  professional?: string;
  patient?: string;
  from?: string | Date;
  until?: string | Date;
}
