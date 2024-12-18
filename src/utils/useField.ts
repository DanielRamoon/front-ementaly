import { FormikContextType, useFormikContext } from 'formik';
import ObjectPath from 'object-path';

interface Field<T> {
  value: T;
  hasError: boolean;

  helperText: string;

  formik: FormikContextType<any>;
}

export function useField<T = string>({
  defaultValue = '',
  ...options
}: {
  name: string;
  defaultValue?: any;
  initialHelperText?: string;
}): Field<T> {
  const formik = useFormikContext<any>();

  const value = ObjectPath.get(formik.values, options.name) ?? defaultValue;
  const error = ObjectPath.get(formik.errors, options.name) || false;
  const isTouched = ObjectPath.get(formik.touched, options.name) || false;

  const hasError = error && isTouched;

  const helperText =
    (hasError && typeof error === 'string' && error) ||
    options.initialHelperText ||
    '';

  return {
    value,
    hasError,
    helperText,
    formik,
  };
}
