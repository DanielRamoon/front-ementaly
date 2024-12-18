import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
} from '@material-ui/core';
import React, { useEffect } from 'react';

import { useField } from '../../utils/useField';

export type TextFieldProps = Omit<MUITextFieldProps, 'name'> & {
  name: string;
  onChangeText?: (text: string) => void;
};

export const TextField = (props: TextFieldProps) => {
  const { value, hasError, helperText, formik } = useField({
    name: props.name,
    initialHelperText: props.helperText as string,
  });

  useEffect(() => {
    props.onChangeText?.(value);
  }, [value]);

  return (
    <MUITextField
      {...props}
      variant={props.variant || 'outlined'}
      name={props.name}
      value={value}
      disabled={formik.isSubmitting}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
      helperText={helperText}
      margin="normal"
      fullWidth={props.fullWidth ?? true}
    />
  );
};
