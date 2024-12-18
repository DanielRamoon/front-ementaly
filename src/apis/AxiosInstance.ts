import axios, { AxiosInstance as Instance } from 'axios';
import firebase from 'firebase';
import React from 'react';
import { IntlShape } from 'react-intl';
import { toast } from 'react-toastify';

import { LocalStorage } from '../services';

const AxiosInstance: Instance & { intl?: IntlShape } = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
});

AxiosInstance.interceptors.request.use(async (config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers.token =
    (await firebase.auth().currentUser?.getIdToken()) ||
    LocalStorage.getToken();

  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response.status === 400) {
      const { key } = response.data;

      if (key) {
        if (
          key === 'objectNotFound' &&
          response.config?.params?.ignoreObjectNotFound
        ) {
          throw error;
        }

        toast.error(
          AxiosInstance.intl?.formatMessage(
            { id: key },
            response.data.metadata,
          ),
        );
      } else {
        toast.error(AxiosInstance.intl?.formatMessage({ id: 'badRequest' }));
      }
    }

    throw error;
  },
);

export default AxiosInstance;
