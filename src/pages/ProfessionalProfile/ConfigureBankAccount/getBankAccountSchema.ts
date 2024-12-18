import { IntlShape } from 'react-intl';
import * as Yup from 'yup';

export function getBankAccountSchema(intl: IntlShape) {
  return Yup.object().shape({
    holderName: Yup.string().required(
      intl.formatMessage({ id: 'validation.required' }),
    ),
    documentNumber: Yup.string().required(
      intl.formatMessage({ id: 'validation.required' }),
    ),
    bank: Yup.string()
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .required(intl.formatMessage({ id: 'validation.required' })),
    agency: Yup.string().required(
      intl.formatMessage({ id: 'validation.required' }),
    ),
    accountType: Yup.string()
      .typeError(intl.formatMessage({ id: 'validation.required' }))
      .required(intl.formatMessage({ id: 'validation.required' })),
    account: Yup.string().required(
      intl.formatMessage({ id: 'validation.required' }),
    ),
    accountDigit: Yup.string().required(
      intl.formatMessage({ id: 'validation.required' }),
    ),
  });
}
