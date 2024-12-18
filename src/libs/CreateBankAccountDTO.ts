export interface CreateBankAccountDTO {
  uuid?: string;

  holderName: string;

  documentNumber: string;

  bank: string;

  agency: string;

  agencyDigit: string;

  accountType: string;

  account: string;

  accountDigit: string;
}
