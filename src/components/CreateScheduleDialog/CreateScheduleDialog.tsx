import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import {
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
  yupToFormErrors,
} from 'formik';
import throttle from 'lodash.throttle';
import { InformationOutline } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { PatientApi, ScheduleApi } from '../../apis';
import { useFormikUtils } from '../../hooks/useFormikUtils';
import {
  BillingStrategies,
  BillingStrategy,
  IPatient,
  IResource,
  ScheduleFulfillment,
  ScheduleFulfillments,
} from '../../libs';
import { joinDateAndTime } from '../../utils/joinDateAndTime';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';
import { getCreateScheduleSchema } from './getCreateScheduleSchema';
import { RecurrenceOption } from './RecurrenceOption';

interface CreateScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (schedule: IResource) => void;
}

interface CreateScheduleFormData {
  patient: IPatient | null;
  date: string | null;
  recurrenceUntil: string | null;
  startTime: string | null;
  endTime: string | null;
  chargedValue: number;

  fulfillment: ScheduleFulfillment;

  recurrence: number;

  billingStrategy: BillingStrategy;

  isNewPatient: boolean;
  newPatientName: string | null;
  newPatientEmail: string | null;
  newPatientPhone: string | null;
}

export const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = (
  props,
) => {
  const { formatMessage } = useIntl();

  const [initialValues] = useState<CreateScheduleFormData>({
    patient: null,
    date: null,
    recurrenceUntil: null,
    startTime: null,
    endTime: null,
    chargedValue: 0,
    fulfillment: ScheduleFulfillments.online,
    billingStrategy: BillingStrategies.payNow,
    recurrence: 0,
    isNewPatient: false,
    newPatientName: null,
    newPatientEmail: null,
    newPatientPhone: null,
  });

  const intl = useIntl();

  const { current: schema } = React.useRef(getCreateScheduleSchema(intl));

  const onSubmit = async (
    values: CreateScheduleFormData,
    bag: FormikHelpers<CreateScheduleFormData>,
  ): Promise<void> => {
    toast.info(intl.formatMessage({ id: 'pleaseWait' }));
    schema.validateSync(values, { abortEarly: false });
    const body = {
      patient: values.patient?.uuid || '',

      startingAt: joinDateAndTime(
        values.date || '',
        values.startTime || '',
      ).toISOString(true),

      endingAt: joinDateAndTime(
        values.date || '',
        values.endTime || '',
      ).toISOString(true),

      billingStrategy: values.billingStrategy,

      fulfillment: values.fulfillment,

      recurrence: values.recurrence,
      recurrenceUntil: values.recurrenceUntil || undefined,

      chargedValue: values.chargedValue,

      isNewPatient: values.isNewPatient,
      newPatientName: values.newPatientName,
      newPatientEmail: values.newPatientEmail,
      newPatientPhone: values.newPatientPhone,
    };
    try {
      const schedules = await ScheduleApi.save(body);

      bag.resetForm();

      props.onComplete(schedules[0]);

      toast.success(intl.formatMessage({ id: 'saved' }));
    } catch (errors) {
      bag.setErrors(yupToFormErrors(errors));
    } finally {
      bag.setSubmitting(false);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}>
      <Form>
        <Dialog
          open={props.open}
          onClose={props.onClose}
          maxWidth="md"
          fullWidth>
          <CloseableDialogTitle onClose={props.onClose}>
            {formatMessage({ id: 'createScheduleDialog.title' })}
          </CloseableDialogTitle>
          <div className="mb-4">
            <Divider />
          </div>

          <CreateScheduleForm {...props} />
        </Dialog>
      </Form>
    </Formik>
  );
};

const recurrenceOptions = [
  {
    label: 'createScheduleDialog.field.recurrence.options.none',
    value: 0,
  },

  {
    label: 'createScheduleDialog.field.recurrence.options.oneWeek',
    value: 1,
  },
  {
    label: 'createScheduleDialog.field.recurrence.options.twoWeeks',
    value: 2,
  },
  {
    label: 'createScheduleDialog.field.recurrence.options.oneMonth',
    value: 4,
  },
];

const CreateScheduleForm: React.FC<CreateScheduleDialogProps> = (props) => {
  const [useCustomRecurrence, setCustomRecurrence] = useState(false);
  const [name, setName] = useState('');
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { formatMessage } = useIntl();

  const throttled = useCallback(throttle(PatientApi.find, 1000), []);

  const searchPatients = useCallback(
    async (search: string): Promise<void> => {
      try {
        setLoading(true);

        const results = await throttled({
          search,
          page: 1,
          pageSize: 10,
        });

        setPatients(results || []);
      } catch {
        // TODO handle error
      } finally {
        setLoading(false);
      }
    },
    [throttled],
  );

  useEffect(() => {
    if (!name.length) return;

    searchPatients(name);
  }, [name, searchPatients]);

  const formik = useFormikContext<CreateScheduleFormData>();

  const { hasError, getErrorMsg } = useFormikUtils();

  return (
    <>
      <DialogContent>
        <FormControl>
          <RadioGroup
            value={formik.values.isNewPatient}
            onChange={() =>
              formik.setFieldValue('isNewPatient', !formik.values.isNewPatient)
            }>
            <FormControlLabel
              control={<Radio value={false} />}
              label={formatMessage({
                id: 'createScheduleDialog.field.isExistentPatient',
              })}
            />
            <FormControlLabel
              control={<Radio value />}
              label={formatMessage({
                id: 'createScheduleDialog.field.isNewPatient',
              })}
            />
          </RadioGroup>
        </FormControl>
        {!formik.values.isNewPatient ? (
          <Autocomplete
            options={patients}
            inputValue={name}
            onInputChange={(_, value) => setName(value)}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            getOptionSelected={(option) => {
              return option.uuid === formik.values.patient?.uuid;
            }}
            onChange={(_, value) => formik.setFieldValue('patient', value)}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                label={formatMessage({
                  id: 'createScheduleDialog.field.patient',
                })}
                error={hasError('patient')}
                helperText={getErrorMsg('patient')}
              />
            )}
          />
        ) : (
          <div>
            <div>
              <TextField
                name="newPatientName"
                autoFocus
                label={formatMessage({
                  id: 'field.name',
                })}
                margin="normal"
                variant="outlined"
                onChange={(e) => {
                  formik.setFieldValue('newPatientName', e.target.value);
                }}
                style={{ width: '100%' }}
                error={hasError('newPatientName')}
                helperText={getErrorMsg('newPatientName')}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                name="newPatientEmail"
                autoFocus
                label={formatMessage({
                  id: 'field.email',
                })}
                margin="normal"
                variant="outlined"
                onChange={(e) => {
                  formik.setFieldValue('newPatientEmail', e.target.value);
                }}
                style={{ width: '49%' }}
                error={hasError('newPatientEmail')}
                helperText={getErrorMsg('newPatientEmail')}
              />
              <TextField
                name="newPatientPhone"
                autoFocus
                label={formatMessage({
                  id: 'field.phone',
                })}
                margin="normal"
                variant="outlined"
                onChange={(e) => {
                  formik.setFieldValue('newPatientPhone', e.target.value);
                }}
                style={{ width: '49%' }}
                error={hasError('newPatientPhone')}
                helperText={getErrorMsg('newPatientPhone')}
              />
            </div>
          </div>
        )}

        <div className="lg:flex">
          <div className="lg:mr-4 flex-1" style={{ minWidth: '50%' }}>
            <KeyboardDatePicker
              value={formik.values.date}
              fullWidth
              autoOk
              inputVariant="outlined"
              format={formatMessage({
                id: 'createScheduleDialog.field.date.format',
              })}
              variant="inline"
              margin="normal"
              onChange={(date) => {
                formik.setFieldValue('date', date?.toISOString());
              }}
              placeholder={formatMessage({
                id: 'createScheduleDialog.field.date.placeholder',
              })}
              label={formatMessage({
                id: 'createScheduleDialog.field.date2.label',
              })}
              error={hasError('date')}
              helperText={getErrorMsg('date')}
            />
          </div>

          <div className="flex">
            <div className="mr-4 flex-1">
              <KeyboardTimePicker
                value={formik.values.startTime}
                inputVariant="outlined"
                className="mr-2"
                variant="inline"
                autoOk
                fullWidth
                ampm={false}
                margin="normal"
                mask="__:__"
                onChange={(date) => {
                  formik.setFieldValue('startTime', date?.toISOString());
                }}
                label={formatMessage({
                  id: 'createScheduleDialog.field.startingAt.label',
                })}
                error={hasError('startTime')}
                helperText={getErrorMsg('startTime')}
              />
            </div>

            <div className="flex-1">
              <KeyboardTimePicker
                value={formik.values.endTime}
                inputVariant="outlined"
                mask="__:__"
                autoOk
                fullWidth
                ampm={false}
                variant="inline"
                margin="normal"
                onChange={(date) => {
                  formik.setFieldValue('endTime', date?.toISOString());
                }}
                label={formatMessage({
                  id: 'createScheduleDialog.field.endingAt.label',
                })}
                error={hasError('endTime')}
                helperText={getErrorMsg('endTime')}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CurrencyTextField
            label={formatMessage({
              id: 'createScheduleDialog.field.chargedValue.label',
            })}
            variant="outlined"
            value={formik.values.chargedValue}
            currencySymbol="R$"
            minimumValue="0"
            outputFormat="number"
            decimalCharacter=","
            digitGroupSeparator="."
            onChange={(_, value) => {
              formik.setFieldValue('chargedValue', value);
            }}
            error={hasError('chargedValue')}
            helperText={getErrorMsg('chargedValue')}
          />
        </div>

        <div className="mt-4">
          <div className="mb-2">
            <FormLabel>
              {formatMessage({
                id: 'createScheduleDialog.field.recurrence.label',
              })}
            </FormLabel>
          </div>
          <div className="flex flex-wrap">
            {recurrenceOptions.map((option) => {
              return (
                <RecurrenceOption
                  key={`recurrence-${option.value}`}
                  label={formatMessage({ id: option.label })}
                  selected={formik.values.recurrence === option.value}
                  onClick={() => {
                    formik.setFieldValue('recurrence', option.value);
                    setCustomRecurrence(false);
                  }}
                />
              );
            })}
            <RecurrenceOption
              label="Outro"
              selected={useCustomRecurrence}
              onClick={() => {
                setCustomRecurrence(true);
                formik.setFieldValue('recurrence', 5);
              }}
            />
          </div>

          <div className="flex flex-wrap my-2">
            {useCustomRecurrence && (
              <div>
                <TextField
                  name="recurrence"
                  autoFocus
                  label={formatMessage({
                    id:
                      'createScheduleDialog.field.recurrence.options.other.label',
                  })}
                  type="number"
                  margin="normal"
                  inputProps={{ min: '0' }}
                  variant="outlined"
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  InputProps={{
                    endAdornment: (
                      <span>
                        {formatMessage({
                          id:
                            'createScheduleDialog.field.recurrence.options.other.endAdornment',
                        })}
                      </span>
                    ),
                  }}
                  onChange={formik.handleChange}
                  style={{ width: 348, marginRight: 16 }}
                />
              </div>
            )}

            {formik.values.recurrence <= 0 ? null : (
              <KeyboardDatePicker
                value={formik.values.recurrenceUntil}
                autoOk
                autoFocus
                inputVariant="outlined"
                format={formatMessage({
                  id: 'createScheduleDialog.field.recurrenceUntil.format',
                })}
                variant="inline"
                margin="normal"
                onChange={(date) => {
                  formik.setFieldValue('recurrenceUntil', date?.toISOString());
                }}
                placeholder={formatMessage({
                  id: 'createScheduleDialog.field.recurrenceUntil.placeholder',
                })}
                label={formatMessage({
                  id: 'createScheduleDialog.field.recurrenceUntil.label',
                })}
                error={hasError('recurrenceUntil')}
                helperText={
                  getErrorMsg('recurrenceUntil') ||
                  formatMessage({
                    id: 'createScheduleDialog.field.recurrenceUntil.helperText',
                  })
                }
              />
            )}
          </div>
          <div>
            <FormControl>
              <FormLabel>
                {formatMessage({
                  id: 'createScheduleDialog.field.billingStrategy.label',
                })}
              </FormLabel>
              <RadioGroup
                value={formik.values.billingStrategy}
                onChange={formik.handleChange('billingStrategy')}>
                <FormControlLabel
                  control={<Radio value={BillingStrategies.payNow} />}
                  label={formatMessage({
                    id: 'createScheduleDialog.field.billingStrategy.payNow',
                  })}
                />
                <FormControlLabel
                  control={<Radio value={BillingStrategies.payLater} />}
                  label={formatMessage({
                    id: 'createScheduleDialog.field.billingStrategy.payLater',
                  })}
                />
              </RadioGroup>
            </FormControl>
          </div>
          {formik.values.billingStrategy === BillingStrategies.payLater && (
            <div className="bg-blue-50 rounded-md px-8 py-4 flex text-blue-500 mt-4">
              <InformationOutline
                style={{ color: 'inherit', marginRight: 8 }}
              />
              <Typography style={{ flex: 1, color: 'inherit' }}>
                A função de pagamento depois do atendimento{' '}
                <b>estará disponível por tempo limitado</b> e será removida ou
                alterada no futuro
              </Typography>
            </div>
          )}
        </div>
      </DialogContent>
      <div className="mt-4">
        <Divider />
      </div>
      <DialogActions>
        <Button size="large" onClick={props.onClose} color="default">
          {formatMessage({ id: 'createScheduleDialog.cancel' })}
        </Button>

        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={() => formik.handleSubmit()}
          color="primary"
          disabled={formik.isSubmitting}>
          {formatMessage({ id: 'createScheduleDialog.confirm' })}
        </Button>
      </DialogActions>
    </>
  );
};
