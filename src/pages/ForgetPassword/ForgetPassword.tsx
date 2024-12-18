import { Button, CircularProgress, Link } from '@material-ui/core';
import ReactGA from 'react-ga4';
import { Formik } from 'formik';
import { ChevronRight } from 'mdi-material-ui';
import React, { useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { UserApi } from '../../apis';
import BoxWrapper from '../../components/BoxWrapper/BoxWrapper';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';

export const ForgetPassword: React.FC = () => {
  const Intl = useIntl();
  const { resetPassword } = useAuth();
  const validationSchema = (): Yup.AnySchema =>
    Yup.object().shape({
      email: Yup.string()
        .email(Intl.formatMessage({ id: 'field.email.error' }))
        .required(Intl.formatMessage({ id: 'field.email.error.required' })),
    });

  const initialValues = {
    email: localStorage.getItem('ementaly.email') || '',
  };

  const handlerSubmit = useCallback(
    async (values: typeof initialValues, { setSubmitting }) => {
      setSubmitting(true);

      const { email } = values;

      await resetPassword(email);

      setSubmitting(false);
    },
    [Intl],
  );

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <BoxWrapper>
      <Title>
        <FormattedMessage id="forgetPassword.title" />
      </Title>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handlerSubmit}>
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
            className="flex flex-col w-4/5 justify-around">
            <p className="text-center w-11/12 m-auto text-gray-400">
              <FormattedMessage id="forgetPassword.description" />
            </p>
            <Input
              handlers={{
                handleChange,
                handleBlur,
              }}
              value={values.email}
              states={{ touched, errors }}
              name="email"
              labelWidth={50}
            />

            <div className="w-full mt-2">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={!isValid}
                endIcon={<ChevronRight />}
                className="w-full">
                {isSubmitting ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <FormattedMessage id="button.send" />
                )}
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <div className="my-4">
        <Link href="/login" color="primary" className="font-bold">
          <FormattedMessage id="forgetPassword.gotToLogin" />
        </Link>
      </div>
    </BoxWrapper>
  );
};
