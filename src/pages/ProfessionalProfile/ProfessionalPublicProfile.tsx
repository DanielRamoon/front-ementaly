import { Button, Typography } from '@material-ui/core';
import { Account, Login as LoginIcon } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { ProfessionalApi } from '../../apis';
import { BoxWrapperDashboard, ItemDTO, TitleDashboard } from '../../components';
import useAuth from '../../hooks/useAuth';
import { IProfessional } from '../../libs';
import ViewProfessionalPublicProfile from './ViewProfessionalPublicProfile';

interface ProfessionalProfileParams {
  uuid: string;
}

type Dialogs = 'approve' | 'reject' | null;

export const ProfessionalPublicProfile: React.FC<
  RouteComponentProps<ProfessionalProfileParams>
> = (props) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<IProfessional>({
    uuid: '',
    name: '',
    avatar: '',
    crm: '',
    crmState: 'MG',
    crp: '',
    crpState: 'MG',
    email: '',
    actAs: [],
    charges: 0,
    sessionDuration: 0,
    birthDate: null,
    documentNumber: '',
    showWhatsapp: false,
    worksWith: [],

    expertises: [],
    education: [],

    aboutMe: '',

    rejectionReason: null,

    status: 'incomplete',
    workingSchedule: {},
    user: {
      email: '',
      lastSignInAt: new Date(),
      name: '',
      status: '',
      type: '',
      uuid: '',
    },
  });

  const getProfessional = useCallback(async () => {
    // Profile will be visible for all users
    let uuid;
    // Public View
    if (props.match.params.uuid) {
      uuid = props.match.params.uuid;
    } else {
      window.location.href = '/login';
      return;
    }
    try {
      const professional = await ProfessionalApi.showPublic(uuid, {
        ignoreObjectNotFound: true,
      });
      setUser(professional);
    } catch (error) {
      window.location.href = '/login';
    }
  }, [props]);

  useEffect(() => {
    getProfessional();
  }, [props]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="professionalProfile.title" />
      </TitleDashboard>
      <div className="mb-8" />
      <BoxWrapperDashboard>
        <section
          id="professional"
          className="h-full bg-white  divide-y divide-gray-300 rounded w-11/12 xl:mx-8 xl:w-8/12">
          <ViewProfessionalPublicProfile
            user={{
              ...user,
              uuid: props.match.params.uuid || currentUser?.uuid || '',
            }}
          />
        </section>
        <section className="flex flex-col w-full ml-8">
          <div
            className="w-11/12 mt-4 rounded-md border-2 p-4"
            style={{ borderColor: '#00B0AB' }}>
            <Typography gutterBottom>
              <b>
                Para poder agendar uma consulta com esse profissional, realize o
                cadastro em nossa plataforma ou entre, caso já seja cadastrado!
              </b>
            </Typography>

            <Button
              variant="contained"
              disableElevation
              color="primary"
              component={Link}
              to="/sign-up/patient"
              startIcon={<Account />}>
              Cadastre-se
            </Button>
            <Button
              variant="contained"
              disableElevation
              style={{ marginLeft: 10 }}
              color="primary"
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}>
              Entre
            </Button>
          </div>
        </section>
      </BoxWrapperDashboard>
    </section>
  );
};
