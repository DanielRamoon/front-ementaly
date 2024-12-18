export interface ISection {
  uuid?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  order: number;
  isLast: boolean;
}
