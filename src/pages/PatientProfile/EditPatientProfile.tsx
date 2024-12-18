import DateFnsUtils from '@date-io/date-fns';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Formik, FormikHelpers } from 'formik';
import { Close, Pencil } from 'mdi-material-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { usePatientProfileStyles } from '..';
import { PatientApi, S3Api } from '../../apis';
import Input from '../../components/Input/Input';
import useAuth from '../../hooks/useAuth';
import { SignFileResources } from '../../libs';
import { LocalStorage } from '../../services';
import { transformClassValidatorToFormikErrors } from '../../utils/transformClassValidatorToFormikErrors';
import { IPatientProfilePagesProps } from './PatientProfile';

const EditPatientProfile: React.FC<IPatientProfilePagesProps> = ({
  userData,
  onHeaderButtonHandler,
  onFinish,
}) => {
  const classes = usePatientProfileStyles();
  const Intl = useIntl();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const validationSchema = (): Yup.AnySchema =>
    Yup.object().shape({
      thumbnail: Yup.string(),
      name: Yup.string().required(
        Intl.formatMessage({ id: 'field.name.error.required' }),
      ),
      email: Yup.string()
        .email(Intl.formatMessage({ id: 'field.email.error' }))
        .required(Intl.formatMessage({ id: 'field.email.error.required' })),
      phone: Yup.string().required(
        Intl.formatMessage({ id: 'field.phone.error.required' }),
      ),
      documentNumber: Yup.string().required(
        Intl.formatMessage({ id: 'field.document.error.required' }),
      ),
      birthDate: Yup.string().required(
        Intl.formatMessage({ id: 'field.birthDate.error.required' }),
      ),
    });

  const { current: schema } = React.useRef(validationSchema());
  const { currentUser } = useAuth();

  const initialValues = {
    thumbnail: '',
    name: userData?.name || currentUser?.name || '',
    email: userData?.email || LocalStorage.getEmail() || '',
    documentNumber: userData?.documentNumber || '',
    phone: userData?.phoneNumber || '',
    birthDate: userData?.birthDate || new Date(),
  };

  const onSubmit = useCallback(async (values: any, bag: FormikHelpers<any>) => {
    try {
      if (!currentUser) return;

      bag.setSubmitting(true);
      const {
        thumbnail,
        name,
        email,
        documentNumber,
        phone,
        birthDate,
      } = values;
      let request: any = {
        uuid: currentUser.uuid,
        name,
        documentNumber,
        email,
        phoneNumber: phone,
        birthDate,
      };

      if (thumbnail) {
        const { publicUrl } = await S3Api.upload({
          file: thumbnail,
          signature: {
            fileType: thumbnail.type,
            prefix: currentUser.uuid,
            resource: SignFileResources.profileImage,
          },
        });
        request = { ...request, avatar: publicUrl };
      }

      await PatientApi.save(request);

      if (onFinish) onFinish();

      toast.success(Intl.formatMessage({ id: 'api.profile.update.save' }));
    } catch (error) {
      toast.error(Intl.formatMessage({ id: 'api.update.user.error' }));

      bag.setErrors(transformClassValidatorToFormikErrors(error));
    } finally {
      bag.setSubmitting(false);
    }
  }, []);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          values,
          touched,
          errors,
        }) => (
          <>
            <section className="w-full">
              <div className="flex flex-wrap justify-between mb-7">
                <div className="flex flex-1 gap-3 items-center">
                  <div
                    id="personal-data"
                    className="flex flex-col items-center">
                    <input
                      accept="image/*"
                      className={classes.photoInput}
                      id="icon-button-file"
                      type="file"
                      onChange={(event) => {
                        if (event.target.files) {
                          setFieldValue('thumbnail', event.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span">
                        <Avatar
                          alt={userData?.name}
                          src={
                            (values.thumbnail &&
                              URL.createObjectURL(values.thumbnail)) ||
                            userData?.avatar
                          }
                          className={classes.avatar}
                        />
                      </IconButton>
                    </label>

                    <label htmlFor="icon-button-file">
                      <Button
                        startIcon={<Pencil />}
                        component="span"
                        color="primary">
                        <FormattedMessage id="patientProfile.button.uploadPic" />
                      </Button>
                    </label>
                  </div>
                  <div className="w-full pr-2">
                    <strong className="block text-base text-gray-900">
                      <Input
                        label={Intl.formatMessage({ id: 'field.name' })}
                        handlers={{
                          handleChange,
                          handleBlur,
                        }}
                        value={values.name}
                        states={{ touched, errors }}
                        name="name"
                        type="text"
                        labelWidth={50}
                        className="w-full"
                        wrapperClassName="my-0"
                      />
                    </strong>
                  </div>
                </div>
                <div className="flex items-center w-full mt-8 md:mt-0 md:w-auto md:pr-8">
                  <Button
                    className="focus:outline-none w-full"
                    color="primary"
                    startIcon={<Close />}
                    onClick={() => onHeaderButtonHandler()}>
                    Cancelar
                  </Button>
                </div>
              </div>
              <Divider />
            </section>
            <div className="w-full xl:w-6/12">
              <Input
                label={Intl.formatMessage({ id: 'field.email' })}
                disabled
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.email}
                states={{ touched, errors }}
                name="email"
                type="email"
                labelWidth={50}
                className="w-full xl:w-10/12"
                wrapperClassName="my-0"
              />
            </div>
            <div className="w-full xl:w-6/12">
              <Input
                label={Intl.formatMessage({ id: 'field.document' })}
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.documentNumber}
                states={{ touched, errors }}
                name="documentNumber"
                type="text"
                labelWidth={50}
                className="w-full xl:w-10/12"
                wrapperClassName="my-0"
              />
            </div>
            <div className="w-full xl:w-6/12">
              <Input
                label={Intl.formatMessage({ id: 'field.phone' })}
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.phone}
                states={{ touched, errors }}
                name="phone"
                type="phone"
                labelWidth={50}
                className="w-full xl:w-10/12"
                wrapperClassName="my-0"
              />
            </div>
            <div className="w-full xl:w-6/12">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  label={Intl.formatMessage({ id: 'field.birthDate' })}
                  id="date-picker-dialog"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  value={values.birthDate}
                  onChange={(date) => setFieldValue('birthDate', date)}
                  className="w-full xl:w-10/12 focus:outline-none"
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="w-full">
              <Button
                className="focus:outline-none w-full xl:w-auto "
                color="primary"
                onClick={() => handleSubmit()}
                variant="contained">
                {isSubmitting ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <FormattedMessage id="button.save" />
                )}
              </Button>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditPatientProfile;
