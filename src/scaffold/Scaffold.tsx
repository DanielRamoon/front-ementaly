import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Drawer,
  Hidden,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from 'mdi-material-ui/Menu';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, Redirect } from 'react-router-dom';

import logoWhiteImg from '../assets/logo_white.png';
import { CreateScheduleDialog } from '../components';
import { TrialExpiredDialog } from '../components/TrialExpiredDialog/TrialExpiredDialog';
import useAuth from '../hooks/useAuth';
import { UserTypes } from '../libs';
import { LocalStorage } from '../services';
import { termsOfUse } from '../utils/termsOfUse';
import { Navigation } from './Navigation';
import { Notifications } from './Notifications/Notifications';
import { Professionals } from './Professionals';
import { useScaffoldStyles } from './useScaffoldStyles';

// eslint-disable-next-line prettier/prettier
interface ScaffoldProps {}

type Dialogs = 'createSchedule' | 'trialExpired' | null;

export const Scaffold: React.FC<ScaffoldProps> = (props) => {
  const [openDialog, setOpenDialog] = useState<Dialogs>(null);
  const [canCreateSchedule, setCanCreateSchedule] = useState(false);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const [isDrawerOpen, setDrawerOpen] = useState(!isMobile);

  const classes = useScaffoldStyles();

  const toggleDrawer = (): void => {
    setDrawerOpen((prev) => !prev);
  };

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const userRoles = LocalStorage.getRoles();

    setCanCreateSchedule(userRoles.some((role) => role === 'createSchedule'));
  }, [currentUser?.uuid]);

  const intl = useIntl();

  const history = useHistory();

  if (!currentUser && LocalStorage.getRoles().length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
        <Redirect to="/login/" />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const closeDialog = (): void => {
    setOpenDialog(null);
  };

  let AddScheduleButtonElement = null;
  let AddTrialButtonElement = null;
  let days = 0;
  let expired = false;

  if (currentUser.professional?.dataLastPayment) {
    const now = new Date();
    const trialDate = new Date(currentUser.professional?.dataLastPayment);
    trialDate.setHours(trialDate.getHours() + 3);
    trialDate.setDate(trialDate.getDate() + 30);
    const diffInMs = Math.abs(now.getTime() - trialDate.getTime());
    days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    expired = now > trialDate;
  }

  if (
    currentUser.type === 'professional' &&
    currentUser.professional?.isTrial
  ) {
    AddTrialButtonElement = (
      <>
        <p
          style={{
            whiteSpace: 'pre',
            textAlign: 'justify',
          }}>
          {expired
            ? intl.formatMessage({ id: 'scaffold.trialTextExpired' })
            : intl.formatMessage({ id: 'scaffold.trialText' }, { days })}
        </p>
        <Button
          size="large"
          variant="contained"
          color="primary"
          style={{ margin: 10 }}
          disableElevation
          onClick={() =>
            history.push(`/professional/payment/${currentUser.uuid}`)
          }>
          {intl.formatMessage({ id: 'scaffold.upgradePlan' })}
        </Button>
      </>
    );
  }

  if (canCreateSchedule) {
    AddScheduleButtonElement = (
      <Button
        size="large"
        variant="contained"
        color="primary"
        disableElevation
        onClick={() => setOpenDialog('createSchedule')}>
        {intl.formatMessage({ id: 'scaffold.newSchedule' })}
      </Button>
    );
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            className={clsx(classes.menuButton)}>
            <MenuIcon />
          </IconButton>
          <div className="flex-grow">
            <img
              src={logoWhiteImg}
              alt="logo ementaly branco"
              className="w-40"
            />
          </div>
          <Hidden smDown>{AddTrialButtonElement}</Hidden>
          <Hidden smDown>{AddScheduleButtonElement}</Hidden>
          <Alert variant="filled" severity="error">
            Seção de Pagamento em manutenção
          </Alert>
          <Notifications />
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !isDrawerOpen && classes.drawerPaperClose,
            ),
          }}
          open={isDrawerOpen}
          onClose={toggleDrawer}>
          <div className={classes.listContainer}>
            <div className={classes.list}>
              <Box mx={4} mt={4} mb={1}>
                <Typography variant="caption">
                  <b>{intl.formatMessage({ id: 'scaffold.navigation' })}</b>
                </Typography>
              </Box>

              <Navigation />

              <Professionals />
            </div>

            <div className={classes.listFooter}>
              <Hidden mdUp>
                <div className="mb-4">{AddTrialButtonElement}</div>
                <div className="mb-4">{AddScheduleButtonElement}</div>
              </Hidden>

              {currentUser.type !== UserTypes.admin && (
                <div className="mb-4">
                  <a
                    href={termsOfUse[currentUser.type || '']}
                    rel="noreferrer"
                    target="_blank">
                    <Typography>
                      {intl.formatMessage({ id: 'scaffold.termsOfUse' })}
                    </Typography>
                  </a>
                </div>
              )}
              <Box className={clsx(classes.logout)}>
                <ButtonBase color="inherit" onClick={logout}>
                  <Typography color="inherit" className={classes.footerItem}>
                    {intl.formatMessage({ id: 'scaffold.logout' })}
                  </Typography>
                </ButtonBase>
              </Box>
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
          <CreateScheduleDialog
            open={openDialog === 'createSchedule'}
            onClose={closeDialog}
            onComplete={(schedule) => {
              closeDialog();

              history.push(`/schedule/${schedule.uuid}`);
            }}
          />
          {currentUser.type === 'professional' && (
            <TrialExpiredDialog
              isTrial={currentUser.professional?.isTrial}
              open={
                expired &&
                history.location.pathname !==
                  `/professional/payment/${currentUser.uuid}`
              }
              onClick={() =>
                history.push(`/professional/payment/${currentUser.uuid}`)
              }
            />
          )}

          {props.children}
        </main>
      </div>
    </div>
  );
};
