import {
  Button,
  createStyles,
  makeStyles,
  Tab,
  TabProps,
  Tabs,
  Theme,
  withStyles,
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { PatientApi } from '../../apis';
import {
  BoxWrapperDashboard,
  ListClinicalFollowUp,
  ListPrescription,
  MemedDialog,
  TitleDashboard,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import { IPatient, UserTypes } from '../../libs';
import FinancialReceipts from '../Financial/FinancialReceipts/FinancialReceipts';
import EditPatientProfile from './EditPatientProfile';
import ViewPatientProfile from './ViewPatientProfile';

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    '&.Mui-selected': {
      outline: 'none',
    },
  },
}))((props: TabProps) => <Tab {...props} />);

export const usePatientProfileStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
    photoInput: {
      display: 'none',
    },
  }),
);

const TABS = [
  {
    label: 'patientProfile.tab.scheduling',
    value: 'scheduling',
  },
  {
    label: 'patientProfile.tab.chat',
    value: 'chat',
  },
  {
    label: 'patientProfile.tab.medicalRecord',
    value: 'medicalRecord',
  },
];

export interface PatientProfileParams {
  uuid: string;
}

export interface IPatientProfilePagesProps {
  userData?: IPatient;
  onHeaderButtonHandler: () => void;
  routeUuid?: string;
  onFinish?: () => void;
}

type Dialogs = 'memed' | null;

type Views =
  | 'profile'
  | 'edit'
  | 'prescriptions'
  | 'finances'
  | 'clinicalFollowUp';

type TabData = { label: string; value: Views };

export const PatientProfile: React.FC<
  RouteComponentProps<PatientProfileParams>
> = (props) => {
  const [dialog, setDialog] = useState<Dialogs>(null);

  const [tabs, setTabs] = useState<TabData[]>([]);

  const [view, setView] = useState<Views>('profile');

  const [userData, setUserData] = useState<IPatient>();
  const [reloadData, setReloadData] = useState<boolean>(false);

  const { currentUser } = useAuth();

  const getPatient = useCallback(async () => {
    if (!currentUser) return;

    let { uuid } = currentUser;

    if (props && props.match.params.uuid) {
      uuid = props.match.params.uuid;
    }

    await PatientApi.show(uuid, {
      ignoreObjectNotFound: uuid === currentUser.uuid,
    })
      .then((res) => setUserData(res))
      .finally(() => setReloadData(false));
  }, []);

  useEffect(() => {
    getPatient();
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setTabs([]);

      return;
    }

    const tabsVisible: TabData[] = [
      {
        label: 'patientProfile.tab.profile',
        value: 'profile',
      },
    ];

    if (currentUser.type === UserTypes.admin) {
      tabsVisible.push({
        label: 'patientProfile.tab.finances',
        value: 'finances',
      });
    } else if (currentUser.type === UserTypes.professional) {
      tabsVisible.push({
        label: 'patientProfile.tab.prescriptions',
        value: 'prescriptions',
      });

      tabsVisible.push({
        label: 'patientProfile.tab.clinicalFollowUp',
        value: 'clinicalFollowUp',
      });
    }

    if (currentUser.uuid === userData?.uuid) {
      tabsVisible.push({
        label: 'patientProfile.tab.prescriptions',
        value: 'prescriptions',
      });
    }

    setTabs(tabsVisible);
  }, [currentUser, userData]);

  useEffect(() => {
    if (reloadData) {
      setView('profile');
      getPatient();
    }
  }, [reloadData]);

  const { formatMessage } = useIntl();

  return (
    <section className="h-full">
      <BoxWrapperDashboard>
        <section className="w-full h-full py-5 px-8 m-8 justify-center">
          <div className="flex items-end mb-8">
            {currentUser?.type === UserTypes.professional && (
              <div className="mr-4">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={() => setDialog('memed')}>
                  {formatMessage({ id: 'patientProfile.memed' })}
                </Button>
              </div>
            )}
            <Tabs
              className="flex flex-wrap"
              onChange={(event, value) => setView(value)}
              value={view}
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="perfil patient tabs">
              {tabs.map((tab) => (
                <StyledTab
                  key={tab.label}
                  label={<FormattedMessage id={tab.label} />}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </div>

          {userData && (
            <MemedDialog
              open={dialog === 'memed'}
              onClose={() => setDialog(null)}
              patient={userData}
            />
          )}

          <section className="w-full h-full justify-center bg-white pl-0 py-8">
            <section className="flex flex-col gap-y-6 flex-wrap xl:flex-row px-8 md:pl-8">
              {view === 'edit' && (
                <EditPatientProfile
                  userData={userData}
                  onHeaderButtonHandler={() => setView('profile')}
                  onFinish={() => setReloadData(true)}
                />
              )}

              {view === 'profile' && (
                <ViewPatientProfile
                  userData={userData}
                  onHeaderButtonHandler={() => setView('edit')}
                />
              )}

              {view === 'prescriptions' && (
                <ListPrescription patient={userData} />
              )}

              {view === 'finances' && (
                <FinancialReceipts uuidUser={userData?.uuid || ''} />
              )}

              {view === 'clinicalFollowUp' && userData && (
                <ListClinicalFollowUp patient={userData} />
              )}
            </section>
          </section>
        </section>
      </BoxWrapperDashboard>
    </section>
  );
};
