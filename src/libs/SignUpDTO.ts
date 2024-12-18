import { UserType } from './UserType';

export interface SignUpDTO {
  name: string;
  email: string;

  invite?: string;

  enableEmailMarketing: boolean;

  type: UserType;
}
