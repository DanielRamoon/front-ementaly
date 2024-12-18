declare module '@unicef/material-ui-currency-textfield' {
  import React from 'react';
  import { TextFieldProps } from '@material-ui/core';

  export interface CurrencyTextFieldProps {
    label: string;
    value: number;
    currencySymbol: string;
    minimumValue: string;
    outputFormat: 'string' | 'number';
    decimalCharacter: string;
    digitGroupSeparator: string;

    onChange: (event: React.ChangeEvent, value: string | number) => void;
  }

  type Props = CurrencyTextFieldProps & Omit<TextFieldProps, 'onChange'>;

  const CurrencyTextField: React.FC<Props>;

  export default CurrencyTextField;
}
