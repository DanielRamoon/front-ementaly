import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MUISelect,
} from '@material-ui/core';
import React from 'react';

import { useField } from '../../utils/useField';

/* eslint-disable-next-line */
export interface SelectProps {
  name: string;
  label: string;

  className?: string;

  options: Array<{ value: string; label: string }>;

  helperText?: string;

  style?: FormControlProps['style'];
}

export const Select = (props: SelectProps) => {
  const { value, hasError, helperText, formik } = useField({
    name: props.name,
    initialHelperText: props.helperText,
  });

  return (
    <FormControl
      error={hasError}
      disabled={formik.isSubmitting}
      style={props.style}
      variant="outlined"
      margin="normal"
      fullWidth
      className={props.className}>
      <InputLabel>{props.label}</InputLabel>
      <MUISelect
        name={props.name}
        value={value}
        label={props.label}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}>
        {props.options.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </MUISelect>
      <FormHelperText error={hasError}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default Select;
