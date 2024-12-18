import { IAddress } from './IAddress';

export interface ICard {
  billing_address: IAddress;
  brand: string;
  created_at: string;
  exp_month: number;
  exp_year: number;
  first_six_digits: string;
  holder_name: string;
  id: string;
  last_four_digits: string;
  status: string;
  type: string;
  updated_at: string;
}
