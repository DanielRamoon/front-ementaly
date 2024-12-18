import { IAddress } from './IAddress';

export interface PublicCreateScheduleDTO {
  professional: string;
  startingAt: string;
  endingAt: string;
  billing: {
    type?: string;
    value?: string;
    card: {
      holderName: string;
      documentNumber: string;
      cardNumber: string;
      expirationDate: string;
      cvv: string;
      uuid?: string;
    };
    persist: boolean;

    address?: IAddress | null;
  };
}
