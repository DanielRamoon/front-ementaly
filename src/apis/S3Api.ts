import { IFileUploadDTO } from '../libs';
import { ISignedFile } from '../libs/ISignedFile';
import AxiosInstance from './AxiosInstance';

export const S3Api = {
  async upload(options: IFileUploadDTO): Promise<ISignedFile> {
    const result = await AxiosInstance.post('/s3/sign-file', options.signature);

    const signedFile: ISignedFile = result.data;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', signedFile.signedUrl);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve({
              ...signedFile,
              fileType: options.file.type,
              name: options.file.name,
            });
          } else {
            reject();
          }
        }
      };

      xhr.setRequestHeader('Content-Type', options.file.type);

      xhr.send(options.file);
    });
  },
};
