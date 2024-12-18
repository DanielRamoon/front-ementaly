import { IntlShape } from 'react-intl';
import * as Yup from 'yup';

export function getProfessionalPaymentSchema(intl: IntlShape) {
  return Yup.object().shape({
    card: Yup.object().when('billing', {
      is: null,
      then: Yup.object()
        .shape({
          holderName: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          documentNumber: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          cardNumber: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          expirationDate: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          cvv: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
        })
        .typeError(intl.formatMessage({ id: 'validation.required' }))
        .required(intl.formatMessage({ id: 'validation.required' })),
    }),
    address: Yup.object().when('billing', {
      is: null,
      then: Yup.object()
        .shape({
          zipcode: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          street: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          streetNumber: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          neighborhood: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          city: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
          state: Yup.string().required(
            intl.formatMessage({ id: 'validation.required' }),
          ),
        })
        .typeError(intl.formatMessage({ id: 'validation.required' }))
        .required(intl.formatMessage({ id: 'validation.required' })),
    }),
  });
}
