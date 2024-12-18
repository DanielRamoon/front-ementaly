import {
  Box,
  Button,
  ButtonBase,
  FormControlLabel,
  Grid,
  Radio,
  Switch,
  Typography,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import getZipCodeDetails from 'cep-promise';
import DeleteForeverIcon from 'mdi-material-ui/DeleteForever';
import clsx from 'clsx';
import { Formik, useFormikContext } from 'formik';
import { Magnify } from 'mdi-material-ui';
import Moment from 'moment';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import visa from 'payment-icons/min/flat/visa.svg';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PatientApi, ProfessionalApi, ScheduleApi } from '../../apis';
import { CardApi } from '../../apis/CardApi';
import {
  DocumentNumberTextField,
  LoadingContainer,
  OrderSummary as OrderSummaryComponent,
  SelectStateOfBrazil,
  TextField,
  TitleDashboard,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import {
  IAddress,
  ICard,
  IProfessional,
  IResource,
  ISchedule,
  PaymentStatuses,
  PublicCreateScheduleDTO,
  ScheduleStatuses,
} from '../../libs';
import { getCheckoutSchema } from './getCheckoutSchema';
import { useCheckoutStyles } from './useCheckoutStyles';

interface CheckoutProps extends RouteComponentProps {}

interface CheckoutFormData {
  uuid?: string;
  name: string;
  phoneNumber: string;

  saveCard: boolean;

  address: IAddress | null;

  card: {
    uuid?: string;
    holderName: string;
    documentNumber: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };

  billing: PublicCreateScheduleDTO['billing'] | null;

  startingAt: string | null;
  endingAt: string | null;

  duration: number;

  professional: string | null;

  expectedTotal: number;
}

function getInitialValues(searchParams: string) {
  const search = new URLSearchParams(searchParams);

  const startingAt = search.get('startingAt');
  const endingAt = search.get('endingAt');

  const duration =
    startingAt && endingAt
      ? getDuration({
          startingAt,
          endingAt,
        })
      : 0;

  return {
    uuid: search.get('schedule') || undefined,
    name: '',
    phoneNumber: '',
    startingAt,
    endingAt,
    professional: search.get('professional'),
    address: {
      zipcode: '',
      street: '',
      streetNumber: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'br',
    },
    saveCard: false,
    billing: null,
    expectedTotal: 0,
    duration,
    card: {
      holderName: '',
      documentNumber: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    },
  };
}

function getDuration(options: {
  startingAt: string;
  endingAt: string;
}): number {
  const startingAt = Moment(options.startingAt);
  const endingAt = Moment(options.endingAt);

  return Math.abs(startingAt.diff(endingAt, 'minutes'));
}

export const Checkout: React.FC<CheckoutProps> = (props) => {
  const [isLoading, setLoading] = useState(false);

  const [schedule, setSchedule] = useState<ISchedule | null>(null);

  const [initialValues, setInitialValues] = useState<CheckoutFormData>(
    getInitialValues(props.location.search),
  );

  const intl = useIntl();

  const { formatMessage } = intl;

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uuid) {
      const navigateToPatientProfile = () => {
        props.history.replace('/patient/profile');
        toast.error(formatMessage({ id: 'missingPatientProfile' }));
      };

      PatientApi.show(currentUser.uuid, { ignoreObjectNotFound: true })
        .then((patient) => {
          if (!patient.documentNumber) {
            navigateToPatientProfile();
          }
        })
        .catch(() => {
          navigateToPatientProfile();
        });
    }
  }, [currentUser]);

  const find = async (options: IResource): Promise<void> => {
    try {
      setLoading(true);

      const result = await ScheduleApi.findOne(options);

      setSchedule(result);

      if (
        result.paymentStatus === PaymentStatuses.paid ||
        result.paymentStatus === PaymentStatuses.skipped
      ) {
        toast.info(formatMessage({ id: 'checkout.scheduleIsPaid' }));

        props.history.replace(`/schedule/${options.uuid}`);

        return;
      }

      setInitialValues((prev) => {
        return {
          ...prev,
          startingAt: result.startingAt,
          endingAt: result.endingAt,
          professional: result.professional.uuid,
          expectedTotal: result.chargedValue,
          duration: getDuration({
            startingAt: result.startingAt,
            endingAt: result.endingAt,
          }),
        };
      });
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialValues.uuid) {
      find({ uuid: initialValues.uuid });
    }
  }, [initialValues.uuid]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const hasValuesFromURL =
    initialValues.startingAt &&
    initialValues.endingAt &&
    initialValues.professional;

  const { current: schema } = React.useRef(getCheckoutSchema(intl));

  if (!isLoading && !hasValuesFromURL) {
    return null;
  }

  if (schedule && schedule.status !== ScheduleStatuses.active) {
    return (
      <div>
        <Typography>
          {formatMessage({ id: 'checkout.cannotActOnSchedule' })}{' '}
          <b>[schedule.status]</b>
        </Typography>
      </div>
    );
  }
  const onSubmit = async (values: CheckoutFormData) => {
    try {
      if (!values.professional || !values.startingAt || !values.endingAt) {
        toast.error(formatMessage({ id: 'checkout.error.urlParams' }));

        return;
      }

      let billing: PublicCreateScheduleDTO['billing'];
      console.log({ values });
      if (values.billing) {
        billing = values.billing;
      } else {
        if (!values.address) {
          toast.error(formatMessage({ id: 'checkout.billingAddressError' }));

          return;
        }

        billing = {
          card: values.card,
          persist: values.saveCard,
          // CardId -> card existent
          // CardHash -> new Card
          type: values.billing ? 'cardId' : 'cardHash',
          address: values.address,
        };
      }

      const payload = {
        uuid: values.uuid,
        professional: values.professional,
        startingAt: values.startingAt,
        endingAt: values.endingAt,

        billing,
      };

      const resource = await ScheduleApi.savePublic(payload);

      props.history.replace(`/schedule/${resource.uuid}`);

      toast.info(formatMessage({ id: 'checkout.requestProcessed' }));
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    }
  };

  return (
    <LoadingContainer loading={isLoading}>
      <TitleDashboard>
        <FormattedMessage id="checkout.title" />
      </TitleDashboard>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}>
        <div>
          <div className="p-2 lg:p-8">
            <Grid container spacing={4} justify="space-around">
              <Grid item xs={12} lg={7}>
                <CheckoutForm />
              </Grid>

              <Grid item xs={12} lg={4}>
                <OrderSummary />
              </Grid>
            </Grid>
          </div>
        </div>
      </Formik>
    </LoadingContainer>
  );
};

const CheckoutForm = () => {
  const [cards, setCards] = useState<ICard[]>([]);

  const [isLoading, setLoading] = useState(false);

  const [cardSelection, setCardSelection] = useState<'existing' | 'new'>(
    'existing',
  );

  const { formatMessage } = useIntl();

  const formik = useFormikContext<CheckoutFormData>();

  const removeCardHandle = async (cardId: string) => {
    setLoading(true);
    try {
      await CardApi.remove(cardId);
      const cardsTmp = cards.filter((c) => c.id !== cardId);
      setCards(cardsTmp);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const find = React.useCallback(async () => {
    try {
      setLoading(true);

      const results = await CardApi.find();
      if (results.length === 0) {
        setCardSelection('new');
      }

      setCards(results);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    find();
  }, []);

  return (
    <div className="bg-white">
      <div className="mb-4">
        <TitleDashboard>
          <FormattedMessage id="checkout.subtitle" />
        </TitleDashboard>
      </div>

      <div />

      <div className="p-2 lg:p-8">
        <div className="mt-4">
          <Typography variant="h6" gutterBottom>
            {formatMessage({
              id: 'checkout.group.card.title',
            })}
          </Typography>

          <LoadingContainer loading={isLoading}>
            <>
              {!cards.length ? null : (
                <div>
                  <CardOption
                    selected={cardSelection === 'existing'}
                    onClick={() => {
                      formik.setFieldValue('card', undefined);
                      formik.setFieldValue('address', undefined);
                      setCardSelection('existing');
                    }}>
                    {formatMessage({ id: 'checkout.existingCard' })}
                  </CardOption>

                  <CardOption
                    selected={cardSelection === 'new'}
                    onClick={() => {
                      formik.setFieldValue('billing', undefined);
                      setCardSelection('new');
                    }}>
                    {formatMessage({ id: 'checkout.newCard' })}
                  </CardOption>
                </div>
              )}

              {cardSelection === 'existing' && (
                <ListCard cards={cards} removeCardHandle={removeCardHandle} />
              )}
              {cardSelection === 'new' && <CreateCardForm />}
            </>
          </LoadingContainer>
        </div>
      </div>
    </div>
  );
};

interface LisCardProps {
  cards: ICard[];
  removeCardHandle: (cardId: string) => void;
}

const ListCard = (props: LisCardProps) => {
  const formik = useFormikContext<CheckoutFormData>();

  const selectCard = (card: ICard) => {
    formik.setFieldValue('billing', {
      value: card.id,
      type: 'cardId',
    });
  };

  const classes = useCheckoutStyles();

  return (
    <div className="mt-4">
      {props.cards.map((card) => {
        let cardBrand = (
          <div className={clsx('rounded-md bg-gray-900', classes.cardBrand)} />
        );

        if (card.first_six_digits.startsWith('5')) {
          cardBrand = (
            <img alt="cardbrand" src={mastercard} width={48} height={32} />
          );
        } else if (card.first_six_digits.startsWith('4')) {
          cardBrand = <img alt="cardbrand" src={visa} width={48} height={32} />;
        }

        return (
          <div
            className="mb-2 flex"
            style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <ButtonBase
              key={`card-${card.id}`}
              onClick={() => selectCard(card)}
              className="block w-full text-left">
              <div className="flex border border-gray-200 w-full p-4 rounded-md items-center">
                <div className="mr-2">{cardBrand}</div>
                <div className="flex-1">
                  <Typography>
                    <b>
                      {`${card.first_six_digits}*** **** ${card.last_four_digits}`}{' '}
                      · Validade: {`${card.exp_month}/${card.exp_year}`}
                    </b>
                  </Typography>
                </div>
                <div>
                  <Radio checked={formik.values.billing?.value === card.id} />
                </div>
              </div>
            </ButtonBase>
            <div>
              <DeleteForeverIcon
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => props.removeCardHandle(card.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CreateCardForm = () => {
  const { formatMessage } = useIntl();

  const formik = useFormikContext<CheckoutFormData>();

  const searchZipCode = React.useCallback(
    async (zipcode: string): Promise<void> => {
      try {
        if (!zipcode) return;

        const { cep, ...others } = await getZipCodeDetails(zipcode);

        formik.setFieldValue('address', { zipcode: cep, ...others });
      } catch {
        toast.error(formatMessage({ id: 'checkout.zipcodeError' }));
      }
    },
    [],
  );

  const classes = useCheckoutStyles();

  return (
    <>
      <div>
        <TextField
          name="card.holderName"
          inputProps={{ maxLength: 64 }}
          label={formatMessage({
            id: 'checkout.field.card.holderName.label',
          })}
          helperText="Máximo de 64 caracteres"
        />
        <DocumentNumberTextField
          name="card.documentNumber"
          label={formatMessage({
            id: 'checkout.field.card.documentNumber.label',
          })}
        />
        <TextField
          name="card.cardNumber"
          label={formatMessage({
            id: 'checkout.field.card.cardNumber.label',
          })}
          placeholder={formatMessage({
            id: 'checkout.field.card.cardNumber.placeholder',
          })}
          InputProps={{ inputComponent: InputMask } as any}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{ mask: '9999 9999 9999 9999', maskChar: '' } as any}
        />
        <div className="flex">
          <TextField
            name="card.expirationDate"
            label={formatMessage({
              id: 'checkout.field.card.expirationDate.label',
            })}
            InputProps={{ inputComponent: InputMask } as any}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            inputProps={{ mask: '99/99', maskChar: '' } as any}
            style={{ marginRight: 16 }}
          />
          <TextField
            name="card.cvv"
            label={formatMessage({
              id: 'checkout.field.card.cvv.label',
            })}
            InputProps={{ inputComponent: InputMask } as any}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            inputProps={{ mask: '999', maskChar: '' } as any}
          />
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={formik.values.saveCard}
              onChange={(_, checked) =>
                formik.setFieldValue('saveCard', checked)
              }
            />
          }
          label={formatMessage({ id: 'checkout.field.card.saveCard' })}
        />
      </div>

      <div className="my-4">
        <Typography variant="h6" gutterBottom>
          {formatMessage({
            id: 'checkout.group.card.billingAddress.title',
          })}
        </Typography>

        <div className="flex items-center">
          <TextField
            name="address.zipcode"
            label={formatMessage({
              id: 'checkout.field.address.zipcode.label',
            })}
            fullWidth={false}
            InputProps={{ inputComponent: InputMask } as any}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            inputProps={{ mask: '99999-999', maskChar: '' } as any}
          />

          <div className="ml-4">
            <Button
              color="primary"
              startIcon={<Magnify />}
              onClick={() =>
                searchZipCode(formik.values.address?.zipcode || '')
              }>
              {formatMessage({ id: 'checkout.searchZipcode' })}
            </Button>
          </div>
        </div>

        <div className="flex">
          <TextField
            name="address.street"
            label={formatMessage({
              id: 'checkout.field.address.street.label',
            })}
            className={classes.streetInput}
          />

          <TextField
            name="address.streetNumber"
            label={formatMessage({
              id: 'checkout.field.address.streetNumber.label',
            })}
            className={classes.streetInput}
          />
        </div>

        <TextField
          name="address.neighborhood"
          label={formatMessage({
            id: 'checkout.field.address.neighborhood.label',
          })}
        />

        <div className="flex">
          <TextField
            name="address.city"
            label={formatMessage({
              id: 'checkout.field.address.city.label',
            })}
            className={classes.cityInput}
          />

          <SelectStateOfBrazil
            name="address.state"
            label={formatMessage({
              id: 'checkout.field.address.state.label',
            })}
            className={classes.stateInput}
          />
        </div>
      </div>
    </>
  );
};

const OrderSummary = () => {
  const formik = useFormikContext<CheckoutFormData>();

  const [professional, setProfessional] = useState<IProfessional | null>(null);

  const { formatMessage } = useIntl();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);

    if (!formik.values.professional) return;

    ProfessionalApi.show(formik.values.professional).then((data) => {
      setProfessional(data);

      if (!search.get('schedule')) {
        const total = getTotal({
          desiredDuration: formik.values.duration,
          sessionDuration: data.sessionDuration,
          sessionCost: data.charges,
        });

        formik.setFieldValue('expectedTotal', total);
      }
    });
  }, []);

  const classes = useCheckoutStyles();

  if (!professional || !formik.values.startingAt || !formik.values.endingAt) {
    return null;
  }

  return (
    <div>
      <OrderSummaryComponent
        professional={professional}
        startingAt={formik.values.startingAt}
        endingAt={formik.values.endingAt}
        total={formik.values.expectedTotal || 0}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={formik.isSubmitting}
          disableElevation
          onClick={() => formik.handleSubmit()}
          className={classes.submitButton}>
          {formatMessage({
            id: 'checkout.button.submit',
          })}
        </Button>
      </div>
    </div>
  );
};

function getTotal(options: {
  desiredDuration: number;
  sessionDuration: number;
  sessionCost: number;
}): number {
  return Math.abs(
    (options.desiredDuration / (options.sessionDuration || 0)) *
      (options.sessionCost || 0),
  );
}

const CardOption = (props: {
  selected: boolean;
  onClick: () => void;
  children: any;
}) => {
  return (
    <div className="mr-2 mb-2 inline-block">
      <ButtonBase onClick={props.onClick}>
        <div className="p-4 inline-block rounded-md border border-gray-200">
          <Box color={props.selected ? 'primary.main' : undefined}>
            <Typography>
              <b>{props.children}</b>
            </Typography>
          </Box>
        </div>
      </ButtonBase>
    </div>
  );
};
