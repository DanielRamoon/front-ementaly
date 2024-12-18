import { UserType } from './UserType';

export interface IUserInviteDTO {
  name: string;
  email: string;

  userType: UserType;
}
