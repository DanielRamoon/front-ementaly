import { isDate, parseISO } from 'date-fns';
import { ConsoleNetwork } from 'mdi-material-ui';
import { IntlShape } from 'react-intl';
import * as Yup from 'yup';

export function getCreateScheduleSchema(intl: IntlShape) {
  return Yup.object().shape({
    patient: Yup.object().when('isNewPatient', (isNewPatient: boolean) => {
      if (!isNewPatient) {
        return Yup.object()
          .shape({
            uuid: Yup.string().required(
              intl.formatMessage({
                id: 'createScheduleDialog.validation.patient',
              }),
            ),
          })
          .typeError(intl.formatMessage({ id: 'validation.required' }))
          .required(intl.formatMessage({ id: 'validation.required' }));
      }
      return Yup.object().nullable().notRequired();
    }),
    newPatientName: Yup.string().when(
      'isNewPatient',
      (isNewPatient: boolean) => {
        if (isNewPatient) {
          return Yup.string()
            .typeError(intl.formatMessage({ id: 'validation.required' }))
            .required(intl.formatMessage({ id: 'validation.required' }));
        }
        return Yup.object().nullable().notRequired();
      },
    ),
    newPatientEmail: Yup.string().when(
      'isNewPatient',
      (isNewPatient: boolean) => {
        if (isNewPatient) {
          return Yup.string()
            .typeError(intl.formatMessage({ id: 'validation.required' }))
            .required(intl.formatMessage({ id: 'validation.required' }));
        }
        return Yup.object().nullable().notRequired();
      },
    ),
    newPatientPhone: Yup.string().when(
      'isNewPatient',
      (isNewPatient: boolean) => {
        if (isNewPatient) {
          return Yup.string()
            .typeError(intl.formatMessage({ id: 'validation.required' }))
            .required(intl.formatMessage({ id: 'validation.required' }));
        }
        return Yup.object().nullable().notRequired();
      },
    ),
    date: Yup.date()
      .transform(parseDateString)
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .required(intl.formatMessage({ id: 'validation.required' })),
    recurrence: Yup.number(),
    recurrenceUntil: Yup.string().when('recurrence', (recurrence: number) => {
      if (recurrence > 0) {
        return Yup.date()
          .transform(parseDateString)
          .typeError(intl.formatMessage({ id: 'validation.required' }))
          .required(intl.formatMessage({ id: 'validation.required' }));
      }

      return Yup.string().nullable().notRequired();
    }),
    startTime: Yup.string()
      .test('isHour', 'Is not hour', isHour)
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .required(intl.formatMessage({ id: 'validation.required' })),
    endTime: Yup.string()
      .test('isHour', '', isHour)
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .required(intl.formatMessage({ id: 'validation.required' })),
    chargedValue: Yup.number()
      .required(intl.formatMessage({ id: 'validation.required' }))
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .min(0, intl.formatMessage({ id: 'validation.positive' })),
  });
}

function parseDateString(_: string, originalValue: string): string | Date {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parseISO(originalValue);

  return parsedDate;
}

function isHour(value: string | undefined): boolean {
  return (value || '').match('[0-9]{2}:[0-9]{2}') !== null;
}
