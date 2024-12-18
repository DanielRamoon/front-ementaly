import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@material-ui/core';
import React, { HTMLAttributes } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export interface InputProps extends OutlinedInputProps {
  handlers?: any;
  states: any;
  name: string;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
  handlers,
  states,
  name,
  type,
  wrapperClassName,
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className={wrapperClassName || `w-full`}>
      <FormControl variant="outlined" margin="normal" className="w-full">
        <InputLabel htmlFor={`outlined-adornment-${name}`}>
          <FormattedMessage id={`field.${name}`} />
        </InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${name}`}
          type={type}
          label={formatMessage({ id: `field.${name}` })}
          name={name}
          onChange={handlers?.handleChange}
          onBlur={handlers?.handleBlur}
          error={states.touched[name] && !!states.errors[name]}
          {...props}
          aria-describedby="component-error-email"
        />
        <FormHelperText id="component-error-email" error>
          {states.touched[name] && states.errors[name]}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default Input;
