export interface ICancelScheduleDTO {
  uuid: string;

  reason: string;

  cancelNextSchedules?: boolean;
}
