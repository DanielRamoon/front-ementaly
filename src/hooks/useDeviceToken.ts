import firebase from 'firebase';
import { useCallback, useEffect, useState } from 'react';

import { Constants } from '../helpers';
import { LocalStorage } from '../services';
import useAuth from './useAuth';

interface DeviceTokenValues {
  clearDeviceToken: () => Promise<void>;
}

export function useDeviceToken(): DeviceTokenValues {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  const { getFirestoreRef } = useAuth();

  const clearDeviceToken = useCallback(async (): Promise<void> => {
    if (deviceToken) {
      await getFirestoreRef().update({ [`devices.${deviceToken}`]: false });
    }
  }, [getFirestoreRef]);

  const getNotificationToken = useCallback(async (): Promise<void> => {
    try {
      if (!firebase.messaging.isSupported()) return;

      const token = await firebase.messaging().getToken({
        vapidKey: Constants.vapidKey,
      });

      setDeviceToken(token);

      const tokens = LocalStorage.getDeviceTokens();

      const isKnownToken = !tokens.some((existing) => existing === token);

      if (!isKnownToken) {
        await getFirestoreRef().update({ [`devices.${token}`]: true });
      }
    } catch {
      // TODO add error message
    }
  }, [getFirestoreRef]);

  useEffect(() => {
    getNotificationToken();
  }, [getFirestoreRef, getNotificationToken]);

  return { clearDeviceToken };
}
