import ReactGA from 'react-ga4';
import { ButtonBase, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';

import { Constants } from '../../helpers';
import { useDeviceToken } from '../../hooks/useDeviceToken';
import { LocalStorage } from '../../services';

interface DashboardPropsProps {}

export const Dashboard: React.FC<DashboardPropsProps> = () => {
  const updateUserContext = (permissions: string[]): VoidFunction => {
    // TODO get user permissons on sign in
    return () => {
      LocalStorage.setRoles(permissions);
      window.location.reload();
    };
  };

  useDeviceToken();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <div className="flex w-full h-full items-center p-8">
      <div className="flex-1 mr-4">
        <ButtonBase onClick={updateUserContext(Constants.roles.admin)}>
          <Typography variant="h4">Visualizar como Administrador</Typography>
        </ButtonBase>
      </div>
      <div className="flex-1 mr-4">
        <ButtonBase onClick={updateUserContext(Constants.roles.patient)}>
          <Typography variant="h4">Visualizar como Paciente</Typography>
        </ButtonBase>
      </div>
      <div className="flex-1">
        <ButtonBase onClick={updateUserContext(Constants.roles.professional)}>
          <Typography variant="h4">Visualizar como Profissional</Typography>
        </ButtonBase>
      </div>
    </div>
  );
};
