import {
  Button,
  Slide,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import clsx from 'clsx';
import firebase from 'firebase';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { ConsentApi } from '../../apis/ConsentApi';
import { TitleDashboard } from '../../components';
import useAuth from '../../hooks/useAuth';
import {
  IAuthenticationToken,
  IChat,
  PatientConsentTypes,
  Statuses,
  UserTypes,
} from '../../libs';
import { FirestoreChatConverter } from '../../utils/FirestoreChatConverter';
import { ChatContent } from './ChatContent';
import { ChatFileInput } from './ChatFileInput';
import { ChatTextInput } from './ChatTextInput';
import { OnGoingChats } from './OnGoingChats';
import { useChatStyle } from './useChatStyle';

interface ChatProps {}

export const Chat: React.FC<ChatProps> = (props) => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  const lastChat = useRef<IChat | null>();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const { currentUser, getFirestoreRef } = useAuth();

  const setOnlineOffline = async (
    chat: firebase.firestore.DocumentReference,
    value: boolean,
  ): Promise<void> => {
    await chat.update({
      [`online.${currentUser?.uuid}`]: value,
    });
  };

  useEffect(() => {
    selectedChat?.ref.update({
      [`pendingMessages.${currentUser?.uuid}`]: 0,
      [`online.${currentUser?.uuid}`]: true,
    });

    return () => {
      lastChat.current = selectedChat;

      if (lastChat.current) {
        setOnlineOffline(lastChat.current.ref, false);
      }
    };
  }, [selectedChat, currentUser]);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (!selectedChat) return;

      setOnlineOffline(selectedChat.ref, false);
    };

    window.onblur = () => {
      if (!selectedChat) return;

      setOnlineOffline(selectedChat.ref, false);
    };

    window.onfocus = () => {
      if (!selectedChat) return;

      setOnlineOffline(selectedChat.ref, true);
    };
  }, [selectedChat]);

  const location = useLocation();

  useEffect(() => {
    if (!currentUser) return;

    const search = new URLSearchParams(location.search);

    const to = search.get('to');

    if (!to) return;

    firebase
      .firestore()
      .collection('chats')
      .where(`members.${to}`, '==', true)
      .where(`members.${currentUser?.uuid}`, '==', true)
      .withConverter(FirestoreChatConverter)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length) {
          const data = snapshot.docs.map((doc) => doc.data());

          const chatToUser = data.filter(
            (chat) => Object.keys(chat.members).length === 2,
          );

          if (chatToUser.length) {
            setSelectedChat(chatToUser[0]);
          }
        } else {
          setSelectedChat({
            uuid: '#',
            ref: firebase.firestore().collection('chats').doc('#'),
            members: [
              {
                ref: firebase.firestore().collection('users').doc(to),
                name: search.get('name') || '',
              },
              { ref: getFirestoreRef(), name: currentUser.name },
            ],
          });
        }
      });
  }, [currentUser]);

  const startChat = async () => {
    if (!selectedChat) return;

    const ref = firebase.firestore().collection('chats').doc();

    await ref.set({
      members: selectedChat.members.reduce((prev, next) => {
        return { ...prev, [next.ref.id]: true };
      }, {}),
      membersMetadata: selectedChat.members,
    });

    const search = new URLSearchParams(location.search);

    const to = search.get('to');
    const userType = search.get('type');

    if (userType === UserTypes.professional && to) {
      await ConsentApi.save({
        professional: to,
        type: PatientConsentTypes.partial,
        status: Statuses.active,
      });
    }

    setSelectedChat((chat) => {
      if (!chat) return null;

      return { ...chat, ref, uuid: ref.id };
    });
  };

  const styles = useChatStyle();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="chat.title" />
      </TitleDashboard>
      <div className="md:p-8">
        <div className="bg-white md:flex">
          <OnGoingChats
            selectedChat={selectedChat}
            onChange={setSelectedChat}
          />
          <Slide
            direction="up"
            in={Boolean(selectedChat)}
            timeout={isMobile ? undefined : 0}
            style={{ position: isMobile ? 'absolute' : undefined, top: 64 }}>
            <div className={clsx(`bg-white`, styles.contentContainer)}>
              {selectedChat && (
                <>
                  <ChatContent
                    chat={selectedChat}
                    onGoBack={() => setSelectedChat(null)}>
                    {selectedChat.uuid === '#' && (
                      <div className="flex-1 items-center justify-center p-8">
                        <div className="bg-gray-100 p-8 rounded-md">
                          <div className="mb-4">
                            <Typography variant="h6" align="center">
                              <b>
                                <FormattedMessage id="chat.start.title" />
                              </b>
                            </Typography>
                            <Typography variant="body2" align="center">
                              <FormattedMessage id="chat.start.description" />
                            </Typography>
                          </div>

                          <div className="flex justify-center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={startChat}>
                              <FormattedMessage id="chat.button.start" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </ChatContent>
                  {selectedChat.uuid !== '#' && (
                    <div className={clsx(`flex p-4`, styles.inputBar)}>
                      <ChatFileInput chat={selectedChat} />
                      <ChatTextInput chat={selectedChat} />
                    </div>
                  )}
                </>
              )}
            </div>
          </Slide>
        </div>
      </div>
    </section>
  );
};

export function getChatName(
  chat: IChat,
  currentUser: IAuthenticationToken | null,
): string {
  return chat.members
    .filter((member) => member.ref.id !== currentUser?.uuid)
    .map((member) => member.name)
    .join(',');
}

interface ChatNameProps {
  chat: IChat;
}

export const ChatName = (props: ChatNameProps) => {
  const [name, setName] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    const refs = props.chat.members
      .filter((member) => member.ref.id !== currentUser?.uuid)
      .map((member) => member.ref);

    Promise.all(refs.map((ref) => ref.get()))
      .then((documents) => documents.map((doc) => doc.data()?.name).join(', '))
      .then(setName);
  }, [props.chat]);

  return <span>{name}</span>;
};
