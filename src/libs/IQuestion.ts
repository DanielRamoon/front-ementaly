export interface IQuestion {
  title: string;
  helperText?: string;
  type: 'short' | 'long' | 'select';
  order: number;
  items?: string[] | null;
}
