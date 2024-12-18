export const termsOfUse: Record<string, string> = {
  patient: process.env.REACT_APP_PATIENT_TERM || '',
  professional: process.env.REACT_APP_PROFESSIONAL_TERM || '',
};
