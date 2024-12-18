import {
  Avatar,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@material-ui/core';
import BellIcon from 'mdi-material-ui/Bell';
import BellOutlineIcon from 'mdi-material-ui/BellOutline';
import React, { useState } from 'react';

import { LoadingContainer } from '../components';
import { INotification } from '../libs';

interface NotificationsProps {}

export const Notifications: React.FC<NotificationsProps> = () => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const [stats] = useState(0);
  const [notifications] = useState<INotification[]>([]);

  const closePopOver = (): void => {
    setPopoverAnchor(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(event) => setPopoverAnchor(event.currentTarget)}>
        <Badge badgeContent={stats} color="secondary">
          {!stats ? <BellOutlineIcon /> : <BellIcon />}
        </Badge>
      </IconButton>

      <Popover
        anchorEl={popoverAnchor}
        open={Boolean(popoverAnchor)}
        onClose={closePopOver}>
        <LoadingContainer loading={false}>
          <List>
            {notifications.map((notification) => {
              return (
                <ListItem key={`notification-${notification.uuid}`}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>

                  <ListItemText />
                </ListItem>
              );
            })}
          </List>
        </LoadingContainer>
      </Popover>
    </>
  );
};
