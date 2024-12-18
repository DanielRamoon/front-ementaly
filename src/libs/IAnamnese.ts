import { IQuestion } from './IQuestion';
import { ISection } from './ISection';

export type AnamneseQuestion = IQuestion & {
  uuid?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  answer?: {
    uuid?: string;
    value?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type AnamneseSection = ISection & { questions: AnamneseQuestion[] };

export interface IAnamnese {
  sections: AnamneseSection[];
}
