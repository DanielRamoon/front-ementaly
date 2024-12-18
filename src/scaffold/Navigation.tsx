import {
  Box,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import { FaceAgent, HelpCircleOutline } from 'mdi-material-ui';
import AccountMultipleIcon from 'mdi-material-ui/AccountMultiple';
import ForumIcon from 'mdi-material-ui/Forum';
import History from 'mdi-material-ui/History';
import ReceiptIcon from 'mdi-material-ui/Receipt';
import ViewDashboardIcon from 'mdi-material-ui/ViewDashboard';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CloseableDialogTitle } from '../components';
import useAuth from '../hooks/useAuth';
import { LocalStorage } from '../services';
import { useScaffoldStyles } from './useScaffoldStyles';

interface NavigationProps {}

interface StaticMenu {
  label: string;
  path: string;
  roles: string[];
  icon: React.ReactElement;
}

const staticMenus: StaticMenu[] = [
  {
    label: 'Perfil',
    path: '/professional/profile',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['createProfessionalProfile'],
  },
  {
    label: 'Perfil',
    path: '/patient/profile',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['createPatientProfile'],
  },
  {
    label: 'Agenda',
    path: '/professional/schedules/agenda',
    icon: <ViewDashboardIcon color="inherit" />,
    roles: ['readScheduleProfessionalUi'],
  },
  {
    label: 'Histórico',
    path: '/professional/schedules/history',
    icon: <History color="inherit" />,
    roles: ['readScheduleProfessionalUi'],
  },
  {
    label: 'Agenda',
    path: '/patient/schedules',
    icon: <ViewDashboardIcon color="inherit" />,
    roles: ['readSchedulePatientUi'],
  },

  {
    label: 'Pacientes',
    path: '/professional/patients',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['linkedPatients'],
  },
  {
    label: 'Profissionais',
    path: '/admin/professionals',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['manageProfessionals'],
  },

  {
    label: 'Pacientes',
    path: '/admin/patients',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['managePatients'],
  },

  {
    label: 'Profissionais',
    path: '/professionals',
    icon: <AccountMultipleIcon color="inherit" />,
    roles: ['professionalsAvailable'],
  },

  {
    label: 'Chat',
    path: '/chat',
    icon: <ForumIcon color="inherit" />,
    roles: ['readChats'],
  },
  {
    label: 'Financeiro',
    path: '/finances',
    icon: <ReceiptIcon color="inherit" />,
    roles: ['readFinances'],
  },
  {
    label: 'Financeiro',
    path: '/finances',
    icon: <ReceiptIcon color="inherit" />,
    roles: [],
  },
];

export const Navigation: React.FC<NavigationProps> = () => {
  const [menus, setMenus] = useState<StaticMenu[]>([]);

  const [dialog, setDialog] = useState<string | null>(null);

  const roles = React.useRef<string[]>([]);

  useEffect(() => {
    const userRoles = LocalStorage.getRoles();

    roles.current = userRoles;

    setMenus(
      staticMenus.filter((menu) => {
        return menu.roles.some((requiredRole) =>
          userRoles.some((userRole) => userRole === requiredRole),
        );
      }),
    );
  }, []);

  const { currentUser } = useAuth();

  const init = async () => {
    try {
      const script = document.createElement('script');

      script.src = 'https://fast.conpass.io/4HcxP13hYnw.js';

      script.onload = () => {
        if (Conpass && currentUser) {
          Conpass.init({
            name: currentUser?.name,
            email: currentUser.email,
            custom_fields: {
              userType: currentUser.type,
            },
          });
        }
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);

        delete (window as any).Conpass;
      };
    } catch {
      return () => {};
    }
  };

  useEffect(() => {
    // init();
  }, [currentUser]);

  const location = useLocation();

  const styles = useScaffoldStyles();

  const theme = useTheme();

  return (
    <>
      <SupportDialog
        open={dialog === 'support'}
        onClose={() => setDialog(null)}
      />
      <List style={{ padding: '0 16px' }}>
        {menus.map((menu) => {
          const isSelected = location.pathname.startsWith(menu.path);
          return (
            <ListItem
              button
              key={menu.label}
              to={menu.path}
              component={Link}
              className={clsx({
                [styles.sideMenuItemSelected]: isSelected,
              })}>
              <ListItemIcon
                className={clsx({
                  [styles.sideMenuItemIcon]: isSelected,
                })}>
                {menu.icon}
              </ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItem>
          );
        })}

        {roles.current.some((menu) => menu === 'support') && (
          <>
            <div className="mt-6">
              <Typography variant="caption" style={{ marginLeft: 16 }}>
                <i>Problemas na plataforma?</i>
              </Typography>

              <Box color="primary" mt={1}>
                <ListItem
                  button
                  onClick={() => setDialog('support')}
                  style={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 6,
                  }}>
                  <ListItemIcon>
                    <FaceAgent color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <b style={{ color: theme.palette.primary.main }}>
                        Suporte
                      </b>
                    }
                  />
                </ListItem>
              </Box>
            </div>
          </>
        )}
      </List>
    </>
  );
};

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

const SupportDialog = (props: SupportDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <CloseableDialogTitle onClose={props.onClose}>
        Problemas na plataforma? Estamos aqui para te ajudar!
      </CloseableDialogTitle>
      <DialogContent style={{ paddingBottom: 48 }}>
        <Typography>
          Qualquer dúvida ou mais informações entre em contato com a Equipe
          E-mentaly pelo e-mail{' '}
          <a href="mailto:suporte@e-mentaly.com">
            <b>suporte@e-mentaly.com</b>
          </a>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
