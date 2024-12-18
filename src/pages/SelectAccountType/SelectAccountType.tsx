import ReactGA from 'react-ga4';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase';
import { ArrowRight } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserApi } from '../../apis';
import LogoImg from '../../assets/logo.png';
import { LoadingContainer } from '../../components';
import BoxWrapper from '../../components/BoxWrapper/BoxWrapper';
import Title from '../../components/Title/Title';
import { goDashboard } from '../../hooks/useAuth';
import { UserType } from '../../libs';
import { LocalStorage } from '../../services';
import { termsOfUse } from '../../utils/termsOfUse';

export const SelectAccountType: React.FC<RouteComponentProps> = () => {
  const [type, setType] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [hasCheckedTermsOfUse, setHasCheckedTermsOfUse] = useState(false);
  const [enableEmailMarketing, setEnableEmailMarketing] = useState(false);

  useEffect(() => {
    setHasCheckedTermsOfUse(false);
  }, [type]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const Intl = useIntl();

  const onSubmit = async (userType: UserType) => {
    try {
      setLoading(true);

      const { currentUser } = firebase.auth();

      if (!currentUser) return;

      await currentUser
        .getIdToken()
        .then((jwt: string | undefined) => {
          if (!jwt) throw new Error();

          LocalStorage.setToken(jwt);
        })
        .then(async () => {
          if (currentUser.uid) {
            await firebase
              .firestore()
              .collection('users')
              .doc(currentUser.uid)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  return doc.ref.set({
                    name: currentUser.displayName,
                  });
                }

                return Promise.resolve();
              });
          }
        })
        .then(() => {
          return UserApi.register({
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            type: userType,
            enableEmailMarketing,
          });
        })
        .then((user) => {
          LocalStorage.setUser(user);

          toast.success(Intl.formatMessage({ id: 'signup.toast.success' }));

          goDashboard(user.type);

          return true;
        });
    } catch {
      toast.error(Intl.formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxWrapper>
      <LoadingContainer loading={isLoading}>
        <div>
          <img src={LogoImg} alt="logo ementaly" className="w-8/12" />
          <Title>
            <FormattedMessage id="selectAccountType.title" />
          </Title>

          <div>
            {['patient', 'professional'].map((userType, index) => {
              const isSelected = type === userType;

              const color = isSelected ? '#55CBC0' : undefined;

              return (
                <div
                  role="button"
                  tabIndex={index}
                  onClick={() => setType(userType)}
                  className="flex cursor-pointer w-full rounded-md border border-gray300 p-8 mb-8"
                  style={{ borderColor: color }}>
                  <div className="flex-1 mr-4">
                    <Typography variant="h6" style={{ color }}>
                      <b>
                        <FormattedMessage
                          id={`selectAccountType.${userType}.title`}
                        />
                      </b>
                    </Typography>

                    <Typography variant="body2" style={{ color }}>
                      <FormattedMessage
                        id={`selectAccountType.${userType}.description`}
                      />
                    </Typography>
                  </div>
                  <div>
                    <ArrowRight style={{ color }} />
                  </div>
                </div>
              );
            })}
          </div>
          {type && (
            <div className="mb-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasCheckedTermsOfUse}
                    onChange={(_, value) => setHasCheckedTermsOfUse(value)}
                  />
                }
                label={
                  <span>
                    Eu li e aceito os{' '}
                    <a
                      href={termsOfUse[type]}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}>
                      <b>termos e condições de uso</b>
                    </a>
                  </span>
                }
              />
            </div>
          )}
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  name="enableEmailMarketing"
                  checked={enableEmailMarketing}
                  onChange={() => setEnableEmailMarketing((prev) => !prev)}
                />
              }
              label="Quero receber notificações da e-mentaly por email"
            />
          </div>
          <div>
            <Button
              disabled={!type || !hasCheckedTermsOfUse}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => {
                if (!type) {
                  return;
                }

                onSubmit(type as UserType);
              }}>
              <FormattedMessage id="selectAccountType.button.submit" />
            </Button>
          </div>
        </div>
      </LoadingContainer>
    </BoxWrapper>
  );
};
