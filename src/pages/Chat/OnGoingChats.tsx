import {
  Avatar,
  Badge,
  Divider,
  FormControlLabel,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import firebase from 'firebase';
import throttle from 'lodash.throttle';
import { Magnify } from 'mdi-material-ui';
import React, { useEffect, useState } from 'react';

import useAuth from '../../hooks/useAuth';
import { IChat } from '../../libs';
import { FirestoreChatConverter } from '../../utils/FirestoreChatConverter';
import { ChatName, getChatName } from './Chat';
import { ChatAvatar } from './ChatAvatar';
import { useChatStyle } from './useChatStyle';

interface OnGoingChatsProps {
  selectedChat: IChat | null;

  onChange: (chat: IChat) => void;
}

type User = { name: string; avatar?: string; online?: boolean };

export const OnGoingChats: React.FC<OnGoingChatsProps> = (props) => {
  const [search, setSearch] = useState('');

  const [chats, setChats] = useState<IChat[]>([]);
  const [matchingChats, setMatchingChats] = useState<IChat[]>([]);

  const { getFirestoreRef, currentUser } = useAuth();

  const [me, setMe] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (!currentUser) return () => {};

    const unsubscribe1 = getFirestoreRef().onSnapshot((user) => {
      if (!user.exists) {
        return;
      }

      const data = user.data();

      if (data) {
        setMe(data as User);
      }
    });

    const unsubscribe2 = firebase
      .firestore()
      .collection('chats')
      .where(`members.${currentUser.uuid}`, '==', true)
      .withConverter(FirestoreChatConverter)
      .onSnapshot((snapshot) => {
        const documents = snapshot.docs.map((doc) => doc.data());

        setChats(documents);

        if (!search.length) {
          setMatchingChats(documents);
        }
      });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [currentUser]);

  const styles = useChatStyle();

  const toggleOnlineOffline = (_: any, checked: boolean) => {
    getFirestoreRef().update({ online: checked });
  };

  const handleSearch = React.useCallback(
    throttle((term: string) => {
      if (!term.length) {
        setMatchingChats(chats);

        return;
      }

      const nextMatch = chats.filter((chat) => {
        const chatName = getChatName(chat, currentUser).toLowerCase();

        return chatName.match(term.toLowerCase()) !== null;
      });

      setMatchingChats(nextMatch);
    }, 1500),
    [chats],
  );

  return (
    <>
      <div className={styles.onGoingChatsRoot}>
        <div
          className={clsx('flex items-center p-4', styles.onGoingChatsTopBar)}>
          <div className="mr-4">
            <Avatar src={me?.avatar} />
          </div>
          <div className="flex-1 mr-2">
            <Typography>
              <b>{me?.name}</b>
            </Typography>
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={me?.online || false}
                onChange={toggleOnlineOffline}
                color="primary"
              />
            }
            label="Online"
          />
        </div>
        <div className="bg-gray-100 p-4">
          <InputBase
            startAdornment={<Magnify style={{ marginRight: 16 }} />}
            value={search}
            fullWidth
            placeholder="Pesquisar..."
            className="bg-white rounded-full px-4 py-2"
            onChange={(event) => {
              setSearch(event.target.value);

              handleSearch(event.target.value);
            }}
          />
        </div>
        <List>
          {matchingChats.map((chat) => {
            const pendingMessages =
              chat.pendingMessages?.[currentUser?.uuid || ''] || 0;

            return (
              <>
                <ListItem
                  key={`chat-${chat.uuid}`}
                  button
                  selected={chat.uuid === props.selectedChat?.uuid}
                  onClick={() => props.onChange(chat)}>
                  <ListItemAvatar>
                    <ChatAvatar chat={chat} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <b>
                        <ChatName chat={chat} />
                      </b>
                    }
                    secondary={chat.lastMessage?.content}
                  />
                  {chat.lastMessage && (
                    <ListItemSecondaryAction
                      className={styles.onGoingChatsSecondaryAction}>
                      <span className="mr-1">
                        <Typography
                          variant="caption"
                          align="center"
                          color={pendingMessages ? 'secondary' : undefined}
                          style={{ marginBottom: 8 }}>
                          {chat.lastMessage?.createdAt.format('HH:mm')}
                        </Typography>
                      </span>
                      <br />

                      <Badge badgeContent={pendingMessages} color="secondary" />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <Divider key={`divider-${chat.uuid}`} />
              </>
            );
          })}
        </List>
      </div>
    </>
  );
};
