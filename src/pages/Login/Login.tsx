import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import { Formik } from 'formik';
import { ChevronRight, Eye, EyeOff, Gmail } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';

import LogoImg from '../../assets/logo.png';
import BoxWrapper from '../../components/BoxWrapper/BoxWrapper';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import useAuth from '../../hooks/useAuth';

export const Login: React.FC<RouteComponentProps> = () => {
  const Intl = useIntl();
  const validationSchema = (): Yup.AnySchema =>
    Yup.object().shape({
      email: Yup.string()
        .email(Intl.formatMessage({ id: 'field.email.error' }))
        .required(Intl.formatMessage({ id: 'field.email.error.required' })),
      password: Yup.string().required(
        Intl.formatMessage({ id: 'field.password.error.required' }),
      ),
    });
  const { authenticate, authenticateGmail } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: localStorage.getItem('ementaly.email') || '',
    password: '',
  };

  const handlerSubmit = useCallback(
    async (values: typeof initialValues, { setSubmitting }) => {
      setSubmitting(true);

      const { email, password } = values;
      await authenticate({ email, password });

      setSubmitting(false);
    },
    [authenticate, initialValues],
  );

  const handlerLoginGoogle = useCallback(() => {
    authenticateGmail();
  }, [authenticateGmail]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <BoxWrapper>
      <img src={LogoImg} alt="logo ementaly" className="w-8/12" />
      <Title>
        <FormattedMessage id="login.title" />
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
            <Input
              handlers={{
                handleChange,
                handleBlur,
              }}
              states={{ touched, errors }}
              name="password"
              placeholder="********"
              type={showPassword ? 'text' : 'password'}
              labelWidth={80}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end">
                    {showPassword ? <Eye /> : <EyeOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <div className="mt-2 w-full">
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
                  <FormattedMessage id="button.enter" />
                )}
              </Button>
            </div>
            <div className="mt-2 w-full">
              <Button
                onClick={handlerLoginGoogle}
                variant="contained"
                color="secondary"
                type="button"
                size="large"
                startIcon={<Gmail />}
                endIcon={<ChevronRight />}
                className="w-full">
                {isSubmitting ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <FormattedMessage id="button.enter.gmail" />
                )}
              </Button>
            </div>
          </form>
        )}
      </Formik>

      <div className="my-4">
        <Link href="/recover-password" color="primary" className="font-bold">
          <FormattedMessage id="login.forgetPassword" />
        </Link>
      </div>
      <div className="my-4">
        <Link href="/signup" color="primary" className="font-bold">
          <FormattedMessage id="login.createAccount" />
        </Link>
      </div>
    </BoxWrapper>
  );
};
