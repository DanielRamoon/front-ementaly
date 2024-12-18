import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase';
import BellIcon from 'mdi-material-ui/Bell';
import BellOutlineIcon from 'mdi-material-ui/BellOutline';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { LoadingContainer } from '../../components';
import useAuth from '../../hooks/useAuth';
import { INotification } from '../../libs';
import { FirestoreNotificationConverter } from '../../utils/FirestoreNotificationConverter';
import { useNotificationsStyle } from './useNotificationsStyle';

interface NotificationsProps {}

export const Notifications: React.FC<NotificationsProps> = () => {
  const [isLoading, setLoading] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const [stats, setStats] = useState(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const closePopOver = (): void => {
    setPopoverAnchor(null);
  };

  const { getFirestoreRef } = useAuth();

  const { formatMessage } = useIntl();

  useEffect(() => {
    getFirestoreRef().onSnapshot((snapshot) => {
      const user = snapshot.data();

      setStats(user?.pendingNotifications || 0);
    });
  }, [getFirestoreRef]);

  const markAsRead = useCallback(
    async (
      snapshot: firebase.firestore.QuerySnapshot<INotification>,
    ): Promise<void> => {
      const batch = firebase.firestore().batch();

      snapshot.docs.forEach((doc) => batch.update(doc.ref, { read: true }));

      await batch.commit();

      await getFirestoreRef().update({ pendingNotifications: 0 });
    },
    [getFirestoreRef],
  );

  const getNotifications = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const notificationCollection = firebase
        .firestore()
        .collection('notifications')
        .where('read', '==', false)
        .where('user', '==', getFirestoreRef());

      const snapshot = await notificationCollection
        .withConverter(FirestoreNotificationConverter)
        .get();

      const documents = snapshot.docs.map((doc) => {
        return doc.data();
      });

      setNotifications(documents);

      await markAsRead(snapshot);
    } catch {
      toast.error(formatMessage({ id: 'notifications.readNotificationError' }));
    } finally {
      setLoading(false);
    }
  }, [formatMessage, getFirestoreRef, markAsRead]);

  useEffect(() => {
    if (popoverAnchor) {
      getNotifications();
    }
  }, [popoverAnchor, getNotifications]);

  const styles = useNotificationsStyle();

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
        <div>
          <div className="mx-4 my-2">
            <Typography variant="h6">
              {formatMessage({ id: 'notifications.title' })}
            </Typography>
          </div>

          <Divider />

          <List className={styles.list}>
            <LoadingContainer loading={isLoading}>
              {notifications.map((notification) => {
                return (
                  <ListItem
                    key={`notification-${notification.uuid}`}
                    className={styles.listItem}>
                    <ListItemAvatar className={styles.avatar}>
                      <Avatar />
                    </ListItemAvatar>

                    <ListItemText
                      primary={<b>{notification.title}</b>}
                      secondary={
                        <>
                          <Typography color="textPrimary" variant="body2">
                            {notification.description}
                          </Typography>
                          <Typography variant="caption">
                            {notification.createdAt.fromNow()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </LoadingContainer>
          </List>
        </div>
      </Popover>
    </>
  );
};
