import React from 'react';
import InputMask from 'react-input-mask';

import { useField } from '../../utils/useField';
import { TextField, TextFieldProps } from '../TextField/TextField';

const EIGHT_DIGIT_NUMBER = '(99) 9999-9999';
const NINE_DIGIT_NUMBER = '(99) 9 9999-9999';

export const PhoneNumberTextField = (props: TextFieldProps) => {
  const { value } = useField({
    name: props.name,
  });

  let currentMask = EIGHT_DIGIT_NUMBER;

  if (value.replace(/[^0-9]/g, '').length <= 10) {
    currentMask = `${EIGHT_DIGIT_NUMBER}9`;
  } else {
    currentMask = NINE_DIGIT_NUMBER;
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

export default PhoneNumberTextField;
