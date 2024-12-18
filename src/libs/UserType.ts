export type UserType = 'professional' | 'admin' | 'patient' | 'guest';

export const UserTypes: Record<UserType, UserType> = {
  admin: 'admin',
  professional: 'professional',
  patient: 'patient',
  guest: 'guest',
};
