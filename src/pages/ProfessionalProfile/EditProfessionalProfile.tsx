import DateFnsUtils from '@date-io/date-fns';
import {
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ReactGA from 'react-ga4';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Formik, FormikHelpers } from 'formik';
import {
  ChevronRight,
  Delete,
  Facebook,
  Instagram,
  Linkedin,
  LinkVariant,
  Plus,
  Whatsapp,
} from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InputMask from 'react-input-mask';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import {
  EducationApi,
  ExpertiseApi,
  ProfessionalApi,
  ProfileApi,
  S3Api,
} from '../../apis';
import { SelectStateOfBrazil } from '../../components';
import Input from '../../components/Input/Input';
import { IExpertise, IProfessional, SignFileResources } from '../../libs';
import { Ages } from '../../libs/IAges';
import {
  ProfessionalType,
  ProfessionalTypes,
} from '../../libs/IProfessionalType';
import { transformClassValidatorToFormikErrors } from '../../utils/transformClassValidatorToFormikErrors';
import { AddEducationDialog } from './AddEducationDialog/AddEducationDialog';
import { useProfessionalProfileStyles } from './useProfessionalProfileStyles';

interface Props {
  user: IProfessional;

  onComplete?: () => void;
}

const EditProfessionalProfile: React.FC<Props> = ({ user, ...props }) => {
  const Intl = useIntl();
  const classes = useProfessionalProfileStyles();

  const [dialog, setDialog] = useState<'addEducation' | null>(null);

  const [options, setOptions] = useState<IExpertise[]>([]);
  const [showWhatsapp, setShowWhatsapp] = useState<boolean>(false);
  const [checkeds, setCheckeds] = useState<IExpertise[]>(user.expertises);
  const [thumbnail, setThumbnail] = useState<null | File>(null);
  const [worksWith, setWorksWith] = useState<any>({
    adult: user?.worksWith?.includes('adult'),
    elderly: user?.worksWith?.includes('elderly'),
  });
  const [professionals, setProfessionals] = useState<any>({
    psychologist: user?.actAs?.includes('psychologist'),
    psychiatrist: user?.actAs?.includes('psychiatrist'),
  });

  const preview = useMemo(() => {
    return thumbnail && URL.createObjectURL(thumbnail);
  }, [thumbnail]);

  useEffect(() => {
    setShowWhatsapp(user.showWhatsapp);
  }, [user]);

  const validateUrl = (url: string) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      url,
    );
  };

  const handlerSubmit = async (
    values: typeof user,
    bag: FormikHelpers<any>,
  ) => {
    bag.setSubmitting(true);
    let errorCount = 0;
    const worksWithArray: Ages[] = [];
    const professionalsArray: ProfessionalType[] = [];
    if (thumbnail) {
      const { publicUrl } = await S3Api.upload({
        file: thumbnail,
        signature: {
          fileType: thumbnail.type,
          prefix: user.uuid,
          resource: SignFileResources.profileImage,
        },
      });
      values = { ...values, avatar: publicUrl };
    }

    if (!values.name) {
      toast.error('Preencha o Nome');
      errorCount += 1;
    }
    if (!values.birthDate) {
      toast.error('Preencha a Data de Nascimento corretamente');
      errorCount += 1;
    }
    if (values.expertises.length === 0) {
      toast.error('É necessário ter ao menos uma característica assinalada');
      errorCount += 1;
    }
    values.charges = Number((`${values.charges}` || '0').replace(',', '.'));

    if (!values.charges || values.charges <= 0) {
      toast.error('Preencha o Preço');
      errorCount += 1;
    }

    if (!values.aboutMe) {
      toast.error('Preencha o campo Sobre Mim');
      errorCount += 1;
    }
    values.sessionDuration = 50;

    const expertisesUuid = values.expertises.map((expertise) => expertise.uuid);

    if (worksWith.adult) worksWithArray.push('adult');
    if (worksWith.elderly) worksWithArray.push('elderly');
    if (professionals.psychologist) professionalsArray.push('psychologist');
    if (professionals.psychiatrist) professionalsArray.push('psychiatrist');

    if (worksWithArray.length === 0) {
      toast.error(
        'É necessário selecionar ao menos um público alvo de atendimento',
      );
      errorCount += 1;
    }

    if (!values.avatar) {
      delete values.avatar;
    }

    const isPsychologist = professionalsArray.some(
      (type) => type === ProfessionalTypes.psychologist,
    );
    const isPsychiatrist = professionalsArray.some(
      (type) => type === ProfessionalTypes.psychiatrist,
    );

    if (!isPsychiatrist && !isPsychologist) {
      toast.error('É obrigatório ter ao menos uma profissão marcada');
      errorCount += 1;
    }
    if (isPsychologist && (!values.crp || !values.crpState)) {
      toast.error('Psicólogos devem preencher o CRP');
      errorCount += 1;
    }

    if (isPsychiatrist && (!values.crm || !values.crmState)) {
      toast.error('Médicos devem preencher o CRM');
      errorCount += 1;
    }
    console.log('before -> ', values);

    if (
      (values.linkedin && !validateUrl(values.linkedin)) ||
      (values.facebook && !validateUrl(values.facebook)) ||
      (values.instagram && !validateUrl(values.instagram)) ||
      (values.externalUrl && !validateUrl(values.externalUrl))
    ) {
      toast.error('O link de redes sociais deve ser uma URL válida');
      errorCount += 1;
    }
    values.linkedin = values.linkedin ? values.linkedin : '';
    values.facebook = values.facebook ? values.facebook : '';
    values.instagram = values.instagram ? values.instagram : '';
    values.externalUrl = values.externalUrl ? values.externalUrl : '';

    values.whatsapp = values.whatsapp ? values.whatsapp : '';
    values.showWhatsapp = showWhatsapp;

    if (values.showWhatsapp && !values.whatsapp) {
      toast.error(
        'Deve haver um número de whatsapp para que o mesmo seja exibido. Favor adicionar o número ou desmarcar a caixa "Exibir WhatsApp para os pacientes?"',
      );
      errorCount += 1;
    }
    values.whatsapp = values.whatsapp.replace(/\D/g, '');
    if (values.whatsapp && values.whatsapp.length < 11) {
      toast.error(
        'O número do whatsapp deve conter o DDD + número. Sem espaços ou símbolos',
      );
      errorCount += 1;
    }
    if (errorCount > 0) {
      bag.setSubmitting(false);
      return;
    }

    try {
      await ProfessionalApi.update({
        ...values,
        expertises: expertisesUuid,
        worksWith: worksWithArray,
        actAs: professionalsArray,
      }).then(async () => {});
      bag.setSubmitting(false);
      toast.success(Intl.formatMessage({ id: 'api.profile.create.save' }));
      props.onComplete?.();

      await Promise.all(
        values.education
          .filter((data) => !data.uuid)
          .map((data) => {
            return EducationApi.create(data);
          }),
      );
    } catch (error) {
      console.log(error);
      // When profile doesn't exist, send a request to create
      bag.setErrors(transformClassValidatorToFormikErrors(error));

      if (!values.uuid) {
        await ProfileApi.create({
          ...values,
          worksWith: worksWithArray,
          actAs: professionalsArray,
          expertises: expertisesUuid,
        })
          .then(async () => {
            bag.setSubmitting(false);
            toast.success(
              Intl.formatMessage({ id: 'api.profile.update.save' }),
            );

            await Promise.all(
              values.education
                .filter((data) => !data.uuid)
                .map((data) => {
                  return EducationApi.create(data);
                }),
            );
            props.onComplete?.();
          })
          .catch((errors) =>
            bag.setErrors(transformClassValidatorToFormikErrors(errors)),
          );
      }
    } finally {
      bag.setSubmitting(false);
    }
  };

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const handlerDeleteCourse = useCallback(
    async (index, setFieldValue) => {
      const uuidDeleted = user.education[index].uuid;
      user.education.splice(index, 1);
      setFieldValue('education', [...user.education]);

      if (uuidDeleted) {
        await EducationApi.delete(uuidDeleted);
      }
    },
    [user],
  );

  const getExpertises = useCallback(async (search: string) => {
    const data = await ExpertiseApi.list(search);
    setOptions(data);
  }, []);

  const autoCompleteOnKeyUp = useCallback(
    async (event, setFieldValue) => {
      if (event.key === 'Enter') {
        const expertise = await ExpertiseApi.create(event.target.value);
        setOptions([...options, expertise]);
        setCheckeds([...checkeds, expertise]);
        user.expertises.push(expertise);
        setFieldValue('expertises', user.expertises);
      } else if (event.target.value) {
        getExpertises(event.target.value);
      }
    },
    [options, checkeds, getExpertises, user.expertises],
  );

  const handlerChangeAutocomplete = useCallback(
    async (value, reason, setFieldValue) => {
      switch (reason) {
        case 'select-option':
          setCheckeds(value);
          setFieldValue('expertises', value);
          break;
        case 'remove-option':
          setCheckeds(value);
          setFieldValue('expertises', value);
          break;

        default:
          break;
      }
    },
    [],
  );

  return (
    <section
      id="professional"
      className="h-full bg-white px-8 rounded mb-10 xl:mx-8">
      <Formik enableReinitialize initialValues={user} onSubmit={handlerSubmit}>
        {({
          handleChange,
          touched,
          handleBlur,
          errors,
          isValid,
          values,
          isSubmitting,
          setFieldValue,
          handleSubmit,
        }) => (
          <div>
            <div
              id="personal-data"
              className="flex justify-between items-center py-6 flex-col">
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={(event) => {
                  if (event.target.files) {
                    setThumbnail(event.target.files[0]);
                  }
                }}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span">
                  <Avatar
                    alt={user.name}
                    src={preview || user.avatar}
                    className={classes.large}
                  />
                </IconButton>
              </label>

              <section className="mb-4 w-full">
                <Input
                  handlers={{
                    handleChange,
                    handleBlur,
                  }}
                  value={values.name}
                  states={{ touched, errors }}
                  name="name"
                  labelWidth={50}
                  className="w-full"
                />
                <div className="md:flex">
                  <div className="flex-1 mr-4">
                    <Input
                      handlers={{
                        handleChange,
                        handleBlur,
                      }}
                      value={values.crp}
                      states={{ touched, errors }}
                      name="crp"
                      labelWidth={180}
                      className="w-full"
                    />
                  </div>
                  <div style={{ width: 208 }}>
                    <SelectStateOfBrazil
                      name="crpState"
                      label="Estado do Registro"
                    />
                  </div>
                </div>
                <div className="md:flex">
                  <div className="flex-1 mr-4">
                    <Input
                      handlers={{
                        handleChange,
                        handleBlur,
                      }}
                      value={values.crm}
                      states={{ touched, errors }}
                      name="crm"
                      labelWidth={180}
                      className="w-full"
                    />
                  </div>
                  <div style={{ width: 208 }}>
                    <SelectStateOfBrazil
                      name="crmState"
                      label="Estado do Registro"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    handlers={{
                      handleChange,
                      handleBlur,
                    }}
                    value={values.charges}
                    states={{ touched, errors }}
                    name="charges"
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    labelWidth={40}
                    className="w-full"
                  />
                </div>

                <div className="md:flex mb-4 items-center">
                  <div className="mr-4" style={{ marginBottom: 7 }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        label={Intl.formatMessage({ id: 'field.birthDate' })}
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        value={values.birthDate}
                        onChange={(date) => setFieldValue('birthDate', date)}
                      />
                    </MuiPickersUtilsProvider>
                  </div>

                  <div>
                    <Input
                      label={Intl.formatMessage({ id: 'field.documentNumber' })}
                      handlers={{
                        handleChange,
                        handleBlur,
                      }}
                      value={values.documentNumber}
                      states={{ touched, errors }}
                      name="documentNumber"
                      type="text"
                      labelWidth={50}
                      wrapperClassName="my-0"
                    />
                  </div>
                </div>

                <h5 className="text-gray-500 font-light text-base">
                  <FormattedMessage id="text.professional" />
                </h5>
                <div className="flex">
                  <FormControlLabel
                    control={<Checkbox name="psychologist" color="primary" />}
                    checked={professionals.psychologist}
                    label={
                      <FormattedMessage id="professionalProfile.professional.psychologist" />
                    }
                    onClick={() =>
                      setProfessionals({
                        ...professionals,
                        psychologist: !professionals.psychologist,
                      })
                    }
                    key="psychologist"
                  />
                  <FormControlLabel
                    control={<Checkbox name="psychiatrist" color="primary" />}
                    checked={professionals.psychiatrist}
                    label={
                      <FormattedMessage id="professionalProfile.professional.psychiatrist" />
                    }
                    onClick={() =>
                      setProfessionals({
                        ...professionals,
                        psychiatrist: !professionals.psychiatrist,
                      })
                    }
                    key="psychiatrist"
                  />
                </div>
              </section>
            </div>
            <div className="mb-4">
              <div className="mb-4">
                <h2 className="font-bold text-lg">
                  <FormattedMessage id="professionalProfile.socialMedia" />
                </h2>
                <Typography variant="caption">
                  <i>Opcional</i>
                </Typography>
              </div>
              <Input
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.linkedin}
                states={{ touched, errors }}
                name="linkedin"
                startAdornment={<Linkedin />}
                labelWidth={40}
                className="w-full"
              />

              <Input
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.facebook}
                states={{ touched, errors }}
                name="facebook"
                startAdornment={<Facebook />}
                labelWidth={40}
                className="w-full"
              />

              <Input
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.instagram}
                states={{ touched, errors }}
                name="instagram"
                startAdornment={<Instagram />}
                labelWidth={40}
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox name="showWhatsapp" color="primary" />}
                checked={showWhatsapp}
                label={
                  <FormattedMessage id="professionalProfile.showWhatsapp" />
                }
                onClick={() => setShowWhatsapp(!showWhatsapp)}
                key="showWhatsapp"
              />

              <InputMask
                mask="(99) 9 9999-9999"
                value={values.whatsapp}
                disabled={!showWhatsapp}
                onChange={(e) => setFieldValue('whatsapp', e.target.value)}>
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    handlers={{
                      handleChange,
                      handleBlur,
                    }}
                    states={{ touched, errors }}
                    name="whatsapp"
                    disabled={!showWhatsapp}
                    startAdornment={<Whatsapp />}
                    labelWidth={40}
                    className="w-full"
                  />
                )}
              </InputMask>

              <Input
                handlers={{
                  handleChange,
                  handleBlur,
                }}
                value={values.externalUrl}
                states={{ touched, errors }}
                name="externalUrl"
                startAdornment={<LinkVariant />}
                labelWidth={40}
                className="w-full"
              />
            </div>
            <div id="skills" className="flex flex-col py-6">
              <section>
                <h2 className="font-bold text-lg mb-2">
                  <FormattedMessage id="professionalProfile.canIHelpYou" />
                </h2>
                <Autocomplete
                  className="w-full"
                  multiple
                  id="expertises"
                  options={options}
                  getOptionLabel={(option) => option.name}
                  onKeyUp={(event) => autoCompleteOnKeyUp(event, setFieldValue)}
                  onChange={(_, value, reason) =>
                    handlerChangeAutocomplete(value, reason, setFieldValue)
                  }
                  defaultValue={checkeds}
                  value={checkeds}
                  // componentName="expertises"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Características"
                    />
                  )}
                />
              </section>
              <section className="w-full flex flex-col mt-4">
                <h4 className="text-gray-500 ml-1 text-base">
                  <FormattedMessage id="professionalProfile.attendanceText" />
                </h4>
                <div className="flex">
                  <FormControlLabel
                    control={<Checkbox name="adult" color="primary" />}
                    checked={worksWith.adult}
                    label={
                      <FormattedMessage id="professionalProfile.attendance.adult" />
                    }
                    onClick={() =>
                      setWorksWith({ ...worksWith, adult: !worksWith.adult })
                    }
                    name="attendanceAdult"
                    key="adult"
                  />
                  <FormControlLabel
                    control={<Checkbox name="elderly" color="primary" />}
                    checked={worksWith.elderly}
                    onClick={() =>
                      setWorksWith({
                        ...worksWith,
                        elderly: !worksWith.elderly,
                      })
                    }
                    label={
                      <FormattedMessage id="professionalProfile.attendance.elderly" />
                    }
                    key="elderly"
                  />
                </div>
              </section>
            </div>
            <div id="courses" className="py-6">
              <h2 className="font-bold text-lg mb-4">
                <FormattedMessage id="professionalProfile.academicFormation" />
              </h2>
              <AddEducationDialog
                open={dialog === 'addEducation'}
                onClose={() => setDialog(null)}
                onConfirm={(data) => {
                  user.education.push(data);

                  setFieldValue('education', [...user.education]);

                  setDialog(null);
                }}
              />
              <div>
                <Button
                  variant="outlined"
                  startIcon={<Plus />}
                  color="primary"
                  onClick={() => setDialog('addEducation')}>
                  <FormattedMessage id="professionalProfile.addEducation" />
                </Button>
              </div>
              {user?.education?.map((course, index) => (
                <div className="flex justify-between">
                  <div className="mt-4" key={course.name}>
                    <h3 className="font-bold text-base mt-1">{course.name}</h3>
                    <h4 className="my-1">
                      {moment(course.from).format('L')} -
                      {course.until
                        ? ` ${moment(course.until).format('L')}`
                        : ` até o momento`}
                    </h4>
                    <p>{course.description}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <IconButton
                      color="secondary"
                      aria-label="upload picture"
                      component="span">
                      <Delete
                        onClick={() =>
                          handlerDeleteCourse(index, setFieldValue)
                        }
                      />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
            <div id="about-me" className="py-6">
              <h2 className="font-bold text-lg">
                <FormattedMessage id="professionalProfile.aboutMe" />
              </h2>

              <textarea
                name="aboutMe"
                value={values.aboutMe}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                placeholder={Intl.formatMessage({
                  id: 'txt.typeHere',
                })}
                className="w-full resize-none border rounded border-gray-300 border-solid p-5"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              endIcon={<ChevronRight />}
              onClick={() => handleSubmit()}
              className="w-full my-4">
              {isSubmitting ? (
                <CircularProgress size="1rem" />
              ) : (
                <FormattedMessage id="button.save" />
              )}
            </Button>

            <div className="mt-4">
              <Button onClick={props.onComplete} fullWidth>
                <FormattedMessage id="professionalProfile.button.cancel" />
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </section>
  );
};

export default EditProfessionalProfile;
