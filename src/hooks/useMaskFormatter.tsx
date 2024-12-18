import { conformToMask } from 'react-text-mask';

type TMaskPatternFormatter = boolean | (string | RegExp)[];
type TMaskPatterns = 'celphone' | 'cnpj' | 'cpf';
type TRecordMaskPatterns = Record<TMaskPatterns, TMaskPatternFormatter>;

const useMaskFormatter = (
  text: string,
  maskPattern: TMaskPatternFormatter,
): string => {
  return conformToMask(text, maskPattern, {
    guide: false,
  }).conformedValue;
};

const useMaskPatterns: TRecordMaskPatterns = {
  celphone: [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  cnpj: [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
  cpf: [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
};

export { useMaskFormatter, useMaskPatterns };
