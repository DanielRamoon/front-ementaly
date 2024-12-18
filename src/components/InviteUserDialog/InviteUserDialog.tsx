import { Button, CircularProgress } from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { UserApi } from '../../apis';
import { UserType } from '../../libs';
import { transformClassValidatorToFormikErrors } from '../../utils/transformClassValidatorToFormikErrors';
import Input from '../Input/Input';

type IFunction = () => void;
type IUserFunctions = 'onClose' | 'onRefresh';

type InviteUserDialogProps = Record<IUserFunctions, IFunction> & {
  userType: UserType;
};

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  onClose,
  onRefresh,
  ...props
}) => {
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      formatMessage({ id: 'field.name.error.required' }),
    ),
    email: Yup.string()
      .email(formatMessage({ id: 'field.email.error' }))
      .required(formatMessage({ id: 'field.email.error.required' })),
  });

  const initialValues = {
    name: '',
    email: '',
    userType: props.userType,
  };

  const onSubmit = useCallback(
    async (values: typeof initialValues, bag: FormikHelpers<any>) => {
      bag.setSubmitting(true);
      try {
        await UserApi.invite(values);
        toast.success(formatMessage({ id: 'api.invitePatient.success' }));
        onRefresh();
        onClose();
      } catch (error) {
        toast.error(formatMessage({ id: 'api.invitePatient.error' }));

        bag.setErrors(transformClassValidatorToFormikErrors(error));
      } finally {
        bag.setSubmitting(false);
      }
    },
    [],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({
        handleSubmit,
        handleChange,
        touched,
        handleBlur,
        errors,
        isValid,
        values,
        isSubmitting,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full justify-around">
          <Input
            label={formatMessage({ id: 'field.name' })}
            handlers={{
              handleChange,
              handleBlur,
            }}
            value={values.name}
            states={{ touched, errors }}
            name="name"
            labelWidth={50}
          />
          <Input
            label={formatMessage({ id: 'field.email' })}
            handlers={{
              handleChange,
              handleBlur,
            }}
            value={values.email}
            states={{ touched, errors }}
            name="email"
            labelWidth={50}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="flex-1 md:flex-none focus:outline-none"
              disabled={!isValid}
              color="primary"
              variant="contained">
              {isSubmitting ? (
                <CircularProgress size="1rem" />
              ) : (
                <FormattedMessage id="button.confirm" />
              )}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};
