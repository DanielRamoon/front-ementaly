export type PatientConsentType = 'partial' | 'complete';

export const PatientConsentTypes: Record<
  PatientConsentType,
  PatientConsentType
> = {
  partial: 'partial',
  complete: 'complete',
};
