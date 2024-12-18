import { useFormikContext } from 'formik';
import ObjectPath from 'object-path';

export function useFormikUtils() {
  const formik = useFormikContext();

  const hasError = (fieldName: string): boolean => {
    const errorMessage = ObjectPath.get(formik.errors, fieldName);
    const isTouched = ObjectPath.get(formik.touched, fieldName);

    return (Boolean(errorMessage) && isTouched) || false;
  };

  const getErrorMsg = (fieldName: string): string => {
    const errorMessage = ObjectPath.get(formik.errors, fieldName);
    const isTouched = ObjectPath.get(formik.touched, fieldName);

    return isTouched ? errorMessage : '';
  };

  return { hasError, getErrorMsg };
}
