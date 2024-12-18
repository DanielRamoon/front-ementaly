import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useFormikContext, yupToFormErrors } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import ReactGA from 'react-ga4';

import { CloseableDialogTitle } from '../../../components';
import Input from '../../../components/Input/Input';
import { IEducation } from '../../../libs/IEducation';

interface AddEducationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (education: IEducation) => void;
}

export const AddEducationDialog = (props: AddEducationDialogProps) => {
  const Intl = useIntl();

  const [newEducation, setNewEducation] = useState<IEducation>(
    {} as IEducation,
  );

  const { touched, errors, ...formik } = useFormikContext<any>();

  const handlerAddCourse = useCallback(
    async (data) => {
      const validationSchema = Yup.object().shape({
        name: Yup.string().required(
          Intl.formatMessage({ id: 'field.titleCourse.error.required' }),
        ),
        description: Yup.string().required(
          Intl.formatMessage({
            id: 'field.descriptionCourse.error.required',
          }),
        ),
        from: Yup.date().required(
          Intl.formatMessage({
            id: 'field.yearFrom.error.required',
          }),
        ),
        until: Yup.date(),
      });

      validationSchema
        .validate(data, { abortEarly: false })
        .then(async () => {
          props.onConfirm(data);

          setNewEducation({} as IEducation);
        })
        .catch((err: Yup.ValidationError) => {
          formik.setErrors(yupToFormErrors(err));
        });
    },
    [Intl],
  );

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="professionalProfile.academicFormation" />
      </CloseableDialogTitle>
      <DialogContent>
        <DialogContentText>
          <Input
            value={newEducation.name}
            states={{ touched, errors }}
            name="titleCourse"
            labelWidth={110}
            onChange={(event) =>
              setNewEducation({ ...newEducation, name: event.target.value })
            }
            className="w-full"
          />

          <textarea
            rows={5}
            value={newEducation.description}
            onChange={(event) =>
              setNewEducation({
                ...newEducation,
                description: event.target.value,
              })
            }
            placeholder={Intl.formatMessage({
              id: 'field.descriptionCourse',
            })}
            className="w-full resize-none border rounded border-gray-300 border-solid p-5"
          />
          <div className="flex gap-2">
            <KeyboardDatePicker
              value={newEducation.from || null}
              fullWidth
              autoOk
              inputVariant="outlined"
              format={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.format',
              })}
              variant="inline"
              margin="normal"
              onChange={(date) =>
                setNewEducation({
                  ...newEducation,
                  from: date?.toISOString(),
                })
              }
              placeholder={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.placeholder',
              })}
              label={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.label',
              })}
              error={Boolean(errors.from)}
              helperText={errors.from}
            />
            <KeyboardDatePicker
              value={newEducation.until || null}
              fullWidth
              autoOk
              inputVariant="outlined"
              format={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.format',
              })}
              variant="inline"
              margin="normal"
              onChange={(date) =>
                setNewEducation({
                  ...newEducation,
                  until: date?.toISOString(),
                })
              }
              placeholder={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.placeholder',
              })}
              label={Intl.formatMessage({
                id: 'createScheduleDialog.field.date.end.label',
              })}
              error={Boolean(errors.until)}
              helperText={errors.until}
            />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handlerAddCourse(newEducation)}
          color="primary"
          disableElevation
          variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
