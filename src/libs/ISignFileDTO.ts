import { SignFileResource } from './SignFileResource';

export interface ISignFileDTO {
  fileType: string;

  prefix: string;

  resource: SignFileResource;
}
