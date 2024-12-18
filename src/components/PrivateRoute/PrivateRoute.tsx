import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

export const PrivateRoute: React.FC<{
  component: any;
  path: string;
  exact: boolean;
}> = (props) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};
