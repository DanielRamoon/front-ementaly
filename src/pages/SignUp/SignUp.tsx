import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import { Formik } from 'formik';
import { ChevronRight, Eye, EyeOff } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import LogoImg from '../../assets/logo.png';
import BoxWrapper from '../../components/BoxWrapper/BoxWrapper';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import useAuth from '../../hooks/useAuth';
import { SignUpDTO, UserType, UserTypes } from '../../libs';
import { termsOfUse } from '../../utils/termsOfUse';

interface SignUpParams {
  type: UserType;
}

export const SignUp: React.FC<RouteComponentProps<SignUpParams>> = (props) => {
  const Intl = useIntl();
  const [hasCheckedTermsOfUse, setHasCheckedTermsOfUse] = useState(false);
  const validationSchema = (): Yup.AnySchema =>
    Yup.object().shape({
      name: Yup.string().required(
        Intl.formatMessage({ id: 'field.name.error.required' }),
      ),
      email: Yup.string()
        .email(Intl.formatMessage({ id: 'field.email.error' }))
        .required(Intl.formatMessage({ id: 'field.email.error.required' })),
      password: Yup.string().required(
        Intl.formatMessage({ id: 'field.password.error.required' }),
      ),
    });

  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const initialValues: SignUpDTO & { password: string } = {
    name: '',
    email: '',
    password: '',
    enableEmailMarketing: false,
    type: props.match.params.type,
  };

  const location = useLocation();

  const handlerSubmit = useCallback(
    async (values: SignUpDTO, { setSubmitting }) => {
      setSubmitting(true);

      const search = new URLSearchParams(location.search);

      await register({ ...values, invite: search.get('invite') || undefined });

      setSubmitting(false);
    },
    [register],
  );

  const publicSignUpUserTypes = [UserTypes.patient, UserTypes.professional];

  if (!publicSignUpUserTypes.some((type) => type === props.match.params.type)) {
    // TODO redirect to landpage

    return null;
  }

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <BoxWrapper>
      <img src={LogoImg} alt="logo ementaly" className="w-8/12" />
      <Title>
        <FormattedMessage id="signup.title" />
      </Title>
      {props.match.params.type === 'professional' && (
        <span style={{ textAlign: 'center' }}>
          <FormattedMessage id="signup.subtitle" />
        </span>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handlerSubmit}>
        {({
          handleSubmit,
          handleChange,
          touched,
          handleBlur,
          values,
          errors,
          isValid,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-2/3 w-4/5 justify-around my-8">
            <Input
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

            <div className="mb-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasCheckedTermsOfUse}
                    onChange={(_, value) => setHasCheckedTermsOfUse(value)}
                  />
                }
                label={
                  <span>
                    Eu li e aceito os{' '}
                    <a
                      href={termsOfUse[props.match.params.type]}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}>
                      <b>termos e condições de uso</b>
                    </a>
                  </span>
                }
              />
            </div>

            <div className="mb-4">
              <FormControlLabel
                control={
                  <Checkbox
                    name="enableEmailMarketing"
                    checked={values.enableEmailMarketing}
                    onChange={handleChange}
                  />
                }
                label="Quero receber notificações da e-mentaly por email"
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disabled={!isValid || !hasCheckedTermsOfUse}
              endIcon={<ChevronRight />}>
              {isSubmitting ? (
                <CircularProgress size="1rem" />
              ) : (
                <FormattedMessage id="button.confirm" />
              )}
            </Button>
          </form>
        )}
      </Formik>
      <div className="my-4">
        <Link href="/login" color="primary" className="font-bold">
          <FormattedMessage id="signup.hasAccount" />
        </Link>
      </div>
    </BoxWrapper>
  );
};
