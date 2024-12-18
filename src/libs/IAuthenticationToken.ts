import { UserType } from './UserType';

export interface IAuthenticationToken {
  professional: any;
  uuid: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  dataLastPayment?: string;
  isTrial?: boolean;
  type?: UserType;
}
