import {
  Button,
  CircularProgress,
  Fab,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuList,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import {
  ArrowExpand,
  ClipboardCheck,
  ClipboardText,
  FileDocument,
  LoginVariant,
} from 'mdi-material-ui';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Jitsi from 'react-jitsi';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ScheduleApi } from '../../apis';
import {
  ListClinicalFollowUp,
  MemedContent,
  TitleDashboard,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import { IResource, ISchedule, ScheduleStatuses } from '../../libs';
import AnamnesisModal from '../PatientProfile/AnamnesisModal';

interface JitsiMeetProps extends RouteComponentProps<IResource> {}

export const JitsiMeet: React.FC<JitsiMeetProps> = (props: JitsiMeetProps) => {
  return <JedaiVideoConfig {...props} />;
};

type Dialogs = 'anamnese' | 'prescription' | 'clinicalFollowUp' | null;

const JedaiVideoConfig = (props: JitsiMeetProps) => {
  const [schedule, setSchedule] = useState<ISchedule | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<Dialogs>(null);

  const [displayName, setDisplayName] = useState('');

  const [mode, setMode] = useState('fullscreen');

  const jitsiApi = React.useRef();

  useEffect(() => {
    if (dialog === null && mode !== 'fullscreen') {
      setMode('fullscreen');
    }

    if (dialog !== null && mode !== 'mini') {
      setMode('mini');
    }
  }, [dialog]);

  useEffect(() => {
    ScheduleApi.findOne({ uuid: props.match.params.uuid }).then(setSchedule);
  }, [props.match.params.uuid]);

  const handleAPI = (api: any) => {
    jitsiApi.current = api;

    api.addEventListener('readyToClose', () => {
      props.history.replace(`/schedule/${props.match.params.uuid}`);
    });
  };

  const { currentUser } = useAuth();

  const history = useHistory();

  const intl = useIntl();

  useEffect(() => {
    if (!schedule) return;

    if (schedule.status !== ScheduleStatuses.confirmed) {
      toast.error(intl.formatMessage({ id: 'jitsiMeet.scheduleNotConfirmed' }));

      history.replace(`/schedule/${schedule.uuid}`);
    }

    if (!currentUser) return;

    if (
      schedule.professional.uuid !== currentUser.uuid &&
      schedule.patient.uuid !== currentUser.uuid
    ) {
      toast.error(intl.formatMessage({ id: 'jitsiMeet.notMemberOfSchedule' }));

      history.replace(`/schedule/${schedule.uuid}`);
    }

    setDisplayName(
      schedule.professional.uuid === currentUser.uuid
        ? schedule.professional.name
        : schedule.patient.name,
    );
  }, [schedule, currentUser]);

  if (!currentUser || !schedule) {
    return null;
  }

  const canStart =
    currentUser.uuid === schedule.professional.uuid && !schedule.startedAt;

  const handleMeetStart = () => {
    ScheduleApi.start({ uuid: props.match.params.uuid }).then(() => {
      setSchedule((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          startedAt: Moment().toISOString(),
        };
      });
    });
  };

  const onCloseDialog = () => {
    setDialog(null);
  };

  let jitsiContainerStyle: React.CSSProperties = {};

  const fullScreenContainer = {
    width: '100%',
    height: 'calc(100vh - 64px - 90px)',
  };

  if (mode === 'fullscreen') {
    jitsiContainerStyle = fullScreenContainer;
  } else if (mode === 'mini') {
    jitsiContainerStyle = {
      width: 400,
      height: 250,
      position: 'absolute',
      bottom: 96,
      right: 24,
      borderRadius: 32,
      overflow: 'hidden',
      border: '2px solid #000',
      background: 'white',
      zIndex: 99,
    };
  }

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <>
      <div>
        <TitleDashboard>
          <FormattedMessage id="jitsiMeet.title" />

          <div>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<LoginVariant />}
              onClick={() => {
                props.history.replace(`/schedule/${props.match.params.uuid}`);
              }}
              style={{ marginRight: 16 }}>
              <FormattedMessage id="jitsiMeet.button.leave" />
            </Button>

            {canStart && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleMeetStart}>
                <FormattedMessage id="jitsiMeet.button.start" />
              </Button>
            )}
          </div>
        </TitleDashboard>
        {dialog !== null && (
          <div className="w-full p-4 md:pt-8" style={{ paddingBottom: 400 }}>
            <div className="bg-white px-4 py-8 rounded-md">
              {dialog === 'clinicalFollowUp' && (
                <div>
                  <ListClinicalFollowUp
                    createMode="inline"
                    patient={schedule.patient}
                  />
                </div>
              )}

              {dialog === 'anamnese' && (
                <AnamnesisModal
                  onClose={onCloseDialog}
                  userData={schedule.patient}
                />
              )}

              {dialog === 'prescription' && (
                <MemedContent
                  open
                  onClose={onCloseDialog}
                  patient={schedule.patient}
                />
              )}
            </div>
          </div>
        )}

        <Jitsi
          containerStyle={jitsiContainerStyle}
          loadingComponent={() => {
            return (
              <div className="w-full h-full flex justify-center items-center">
                <CircularProgress />
              </div>
            );
          }}
          domain="meet.jit.si"
          onAPILoad={handleAPI}
          roomName={`ementaly-${props.match.params.uuid}`}
          displayName={displayName}
          interfaceConfig={interfaceConfig as any}
          config={config}
        />

        {schedule.professional.uuid === currentUser.uuid && (
          <>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              onClick={() => setAnchorEl(null)}>
              <MenuList>
                <ListItem button onClick={() => setDialog('anamnese')}>
                  <ListItemIcon>
                    <ClipboardCheck style={{ marginRight: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<FormattedMessage id="jitsiMeet.list.anamnese" />}
                  />
                </ListItem>
                <ListItem button onClick={() => setDialog('clinicalFollowUp')}>
                  <ListItemIcon>
                    <FileDocument style={{ marginRight: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="jitsiMeet.list.clinicalFollowUp" />
                    }
                  />
                </ListItem>

                <ListItem button onClick={() => setDialog('prescription')}>
                  <ListItemIcon>
                    <ClipboardText style={{ marginRight: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="jitsiMeet.list.prescription" />
                    }
                  />
                </ListItem>
              </MenuList>
            </Menu>
            {mode === 'mini' && (
              <Fab
                variant="extended"
                color="primary"
                onClick={() => {
                  setMode('fullscreen');
                  setDialog(null);
                }}
                style={{ position: 'fixed', right: 276, bottom: 24 }}>
                <ArrowExpand style={{ marginRight: 16 }} />
                Tela Cheia
              </Fab>
            )}
            <Fab
              variant="extended"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              style={{ position: 'fixed', right: 24, bottom: 24 }}>
              <ClipboardCheck style={{ marginRight: 16 }} />
              <FormattedMessage id="jitsiMeet.button.fab" />
            </Fab>
          </>
        )}
      </div>
    </>
  );
};

const interfaceConfig = {
  LANG_DETECTION: false,
  lang: 'es',
  APP_NAME: 'Ementaly',
  HIDE_INVITE_MORE_HEADER: true,
  MOBILE_APP_PROMO: false,
  SHOW_CHROME_EXTENSION_BANNER: false,
  TOOLBAR_BUTTONS: [
    'microphone',
    'camera',
    'fullscreen',
    'fodeviceselection',
    // 'hangup',
    'profile',
    'settings',
    'videoquality',
    'tileview',
    'download',
    // 'security'
  ],
};

const config = {
  defaultLanguage: 'es',
  prejoinPageEnabled: false,
  disableDeepLinking: true,
};
