import 'moment/locale/pt-br';
import ReactGA from 'react-ga4';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import firebase from 'firebase';
import moment from 'moment';
import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components';
import LanguagesEn from './data/translaction/en';
import LanguagesPtBr from './data/translaction/pt';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import {
  AdminPatients,
  AdminProfessionals,
  Chat,
  Checkout,
  Dashboard,
  Financial,
  ForgetPassword,
  JitsiMeet,
  ListProfessionals,
  ListPublicProfessionals,
  ListSchedules,
  Login,
  PatientProfile,
  ProfessionalPatients,
  ProfessionalProfile,
  ProfessionalPublicProfile,
  ProfessionalSchedule,
  ProfessionalScheduleHistory,
  ScheduleDetails,
  SignUp,
  SignUpGeneral,
} from './pages';
import { SelectAccountType } from './pages/SelectAccountType/SelectAccountType';
import { Scaffold } from './scaffold/Scaffold';
import { ProfessionalPayment } from './pages/ProfessionalPayment/ProfessionalPayment';

const TRACKING_ID = 'G-RQYB0E1K07'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00B0AB',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontWeightBold: 700,
  },
});
const initLocale = 'pt-br';
const messages = {
  'pt-br': LanguagesPtBr,
  en: LanguagesEn,
};

const App: React.FC = () => {
  moment.locale(initLocale);


  useEffect(() => {
    ReactGA.send('pageview');
  }, []);


  useEffect(() => {

    if (!firebase.messaging.isSupported()) {
      return () => {};
    }

    const unsubscribe = firebase.messaging().onMessage((payload) => {
      // eslint-disable-next-line no-new
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        tag: payload.notification.title,
      });
      // ...
    });

    return () => unsubscribe();

  
    
  }, []);

  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <LanguageProvider initLocale={initLocale} messages={messages}>
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <Route
                path="/recover-password"
                exact
                component={ForgetPassword}
              />
              <Route path="/signup" exact component={SignUpGeneral} />
              <Route path="/sign-up/:type" exact component={SignUp} />
              <Route path="/login" exact component={Login} />
              <Route path="/" exact component={Login} />
              <Route
                path="/public/professionals"
                exact
                component={ListPublicProfessionals}
              />
              <Route
                path="/professional/public/profile/:uuid"
                exact
                component={ProfessionalPublicProfile}
              />
              <PrivateRoute
                path="/account-type"
                exact
                component={SelectAccountType}
              />

              <Scaffold>
                <PrivateRoute path="/" exact component={Dashboard} />
                <PrivateRoute path="/chat" exact component={Chat} />
                <PrivateRoute
                  path="/patient/schedules"
                  exact
                  component={ListSchedules}
                />
                <PrivateRoute
                  path="/professional/profile"
                  exact
                  component={ProfessionalProfile}
                />
                <PrivateRoute
                  path="/professional/profile/:uuid"
                  exact
                  component={ProfessionalProfile}
                />
                <PrivateRoute
                  path="/professional/payment/:uuid"
                  exact
                  component={ProfessionalPayment}
                />
                <PrivateRoute
                  path="/professional/schedules/agenda"
                  exact
                  component={ProfessionalSchedule}
                />
                <PrivateRoute
                  path="/professional/schedules/history"
                  exact
                  component={ProfessionalScheduleHistory}
                />
                <PrivateRoute
                  path="/professional/patients"
                  exact
                  component={ProfessionalPatients}
                />
                <PrivateRoute
                  path="/admin/professionals"
                  exact
                  component={AdminProfessionals}
                />
                <PrivateRoute
                  path="/professionals"
                  exact
                  component={ListProfessionals}
                />
                <PrivateRoute
                  path="/admin/patients"
                  exact
                  component={AdminPatients}
                />
                <PrivateRoute
                  path="/patient/profile/:uuid?"
                  exact={false}
                  component={PatientProfile}
                />

                <PrivateRoute path="/checkout" exact component={Checkout} />

                <PrivateRoute
                  path="/schedule/:uuid"
                  exact
                  component={ScheduleDetails}
                />

                <PrivateRoute
                  path="/schedule/:uuid/meet"
                  exact={false}
                  component={JitsiMeet}
                />
                <PrivateRoute path="/finances" exact component={Financial} />
                <PrivateRoute
                  path="/patient-profile"
                  exact
                  component={PatientProfile}
                />
              </Scaffold>

              <Route render={() => <Redirect to="/login" />} />
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
