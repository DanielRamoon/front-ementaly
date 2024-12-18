import React from 'react';
import InputMask from 'react-input-mask';

import { useField } from '../../utils/useField';
import { TextField, TextFieldProps } from '../TextField/TextField';

const CPF_MASK = '999.999.999-99';
const CNPJ_MASK = '99.999.999/9999-99';

export const DocumentNumberTextField = (props: TextFieldProps) => {
  const { value } = useField({ name: props.name });

  let currentMask = CPF_MASK;

  if (value.replace(/[^0-9]/g, '').length <= 11) {
    currentMask = `${CPF_MASK}9`;
  } else {
    currentMask = CNPJ_MASK;
  }

  return (
    <TextField
      {...props}
      InputProps={{ inputComponent: InputMask } as any}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      inputProps={{ mask: currentMask, maskChar: '' } as any}
    />
  );
};

export default DocumentNumberTextField;
