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
import clsx from 'clsx';
import { Formik, useFormikContext } from 'formik';
import { ConsoleNetwork, Consolidate, Magnify } from 'mdi-material-ui';
import DeleteForeverIcon from 'mdi-material-ui/DeleteForever';
import Moment from 'moment';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import visa from 'payment-icons/min/flat/visa.svg';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import './plan.css';
import { ProfessionalApi } from '../../apis';
import { CardApi } from '../../apis/CardApi';
import {
  DocumentNumberTextField,
  LoadingContainer,
  SelectStateOfBrazil,
  TextField,
  TitleDashboard,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import {
  IAddress,
  IAuthenticationToken,
  ICard,
  IProfessional,
} from '../../libs';
import { getProfessionalPaymentSchema } from './getProfessionalPaymentSchema';
import { useProfessionalPaymentStyles } from './useProfessionalPaymentStyles';
import { LocalStorage } from '../../services';

interface CheckoutProps extends RouteComponentProps {}

export interface ProfessionalPaymentFormData {
  uuid?: string;
  name: string;
  phoneNumber: string;

  saveCard: boolean;

  address: IAddress | null;
  cardId?: string;
  card?: {
    uuid?: string;
    holderName: string;
    documentNumber: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };

  professional: string | null;
}

export const ProfessionalPayment: React.FC<CheckoutProps> = (props) => {
  const [isLoading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const history = useHistory();
  const initialValues: ProfessionalPaymentFormData = {
    name: currentUser?.name || '',
    phoneNumber: currentUser?.professional.whatsapp,
    professional: currentUser?.uuid || '',
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
    card: {
      holderName: '',
      documentNumber: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    },
  };

  const intl = useIntl();

  const { formatMessage } = intl;

  const { current: schema } = React.useRef(getProfessionalPaymentSchema(intl));

  const onSubmit = async (values: ProfessionalPaymentFormData) => {
    setLoading(true);
    try {
      const result = await ProfessionalApi.monthlyPayment(values);
      console.log({ result });
      if (result.status === 'paid') {
        // TODO - alterar data no currenteUser
        const newUserData: IAuthenticationToken | null = {
          ...currentUser,
          professional: {
            ...currentUser?.professional,
            dataLastPayment: result.newDate,
            isTrial: false,
          },
        } as IAuthenticationToken;

        setCurrentUser(newUserData);
        LocalStorage.setUser(newUserData);
        history.replace('/professional/profile');
      } else {
        toast.error(formatMessage({ id: 'checkout.cardError' }));
      }
    } catch (error: any) {
      toast.error(formatMessage({ id: 'checkout.cardError' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <LoadingContainer loading={isLoading}>
      <TitleDashboard>
        <FormattedMessage id="professionalPayment.title" />
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
                <ProfessionalPaymentForm />
              </Grid>

              <Grid item xs={12} lg={4}>
                <BannerComponent />
              </Grid>
            </Grid>
          </div>
        </div>
      </Formik>
    </LoadingContainer>
  );
};

const ProfessionalPaymentForm = () => {
  const [cards, setCards] = useState<ICard[]>([]);

  const { currentUser } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const [cardSelection, setCardSelection] = useState<'existing' | 'new'>(
    'existing',
  );

  const { formatMessage } = useIntl();

  const classes = useProfessionalPaymentStyles();

  const formik = useFormikContext<ProfessionalPaymentFormData>();

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
      <div className="p-2 lg:p-8">
        <div className="mt-4">
          <Typography variant="h6" gutterBottom>
            {formatMessage({
              id: 'checkout.group.card.title',
            })}
          </Typography>
          <LoadingContainer loading={isLoading}>
            <>
              {cards.length === 0 ? null : (
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
                  id: `professionalPayment.button.${
                    currentUser?.professional.isTrial ? 'submit' : 'renew'
                  }`,
                })}
              </Button>
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
  const [isLoading, setLoading] = useState(false);
  const formik = useFormikContext<ProfessionalPaymentFormData>();
  const selectCard = (card: ICard) => {
    formik.setFieldValue('cardId', card.id);
    formik.setFieldValue('saveCard', false);
  };

  const classes = useProfessionalPaymentStyles();

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
                  <Radio checked={formik.values.cardId === card.id} />
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

  const formik = useFormikContext<ProfessionalPaymentFormData>();
  const classes = useProfessionalPaymentStyles();
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

const BannerComponent: React.FC = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h1 className="plan-title">Valor</h1>
        <p className="plan-value">
          <span>R$</span> 29,90
        </p>
        <p className="trial-period">Mensal</p>
        <hr />
        <h2 className="benefits-title">Vantagens</h2>
        <ul className="benefits-list">
          <li className="benefits-item">Suporte 8x5 (Horário comercial)</li>
          <li className="benefits-item">Visibilidade total</li>
        </ul>
      </div>
    </div>
  );
};
