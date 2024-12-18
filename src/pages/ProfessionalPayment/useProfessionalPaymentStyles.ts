import { makeStyles } from '@material-ui/core';

export const useProfessionalPaymentStyles = makeStyles(() => {
  return {
    avatar: { width: 64, height: 64 },
    cardBrand: {
      width: 48,
      height: 32,
    },
    streetInput: { flex: 0.7, marginRight: 16 },
    streetNumberInput: { flex: 0.3 },

    cityInput: { flex: 0.7, marginRight: 16 },
    stateInput: { flex: 0.3 },
    submitButton: {
      padding: 16,
      fontSize: 18,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  };
});
