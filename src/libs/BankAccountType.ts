export type BankAccountType =
  | 'conta_corrente'
  | 'conta_corrente_conjunta'
  | 'conta_poupanca'
  | 'conta_poupanca_conjunta';

export const BankAccountTypes = {
  contaCorrente: 'conta_corrente',
  contaCorrenteConjunta: 'conta_corrente_conjunta',
  contaPoupanca: 'conta_poupanca',
  contaPoupancaConjunta: 'conta_poupanca_conjunta',
};
