import { Hidden, IconButton, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ArrowLeft } from 'mdi-material-ui';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import InfiniteScroll from 'react-infinite-scroll-component';

import useAuth from '../../hooks/useAuth';
import { IChat, IChatMessage } from '../../libs';
import { FirestoreChatMessageConverter } from '../../utils/FirestoreChatMessageConverter';
import { ChatName, getChatName } from './Chat';
import { ChatAvatar } from './ChatAvatar';
import { ChatMessage } from './ChatMessage';
import { useChatStyle } from './useChatStyle';

interface ChatContentProps {
  chat: IChat;
  onGoBack: () => void;

  children?: any;
}

export const ChatContent: React.FC<ChatContentProps> = (props) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const [selectedMessage, setSelectedMessage] = useState<IChatMessage | null>(
    null,
  );

  const [limit, setLimit] = useState(30);

  useEffect(() => {
    props.chat.ref
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .withConverter(FirestoreChatMessageConverter)
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data());

        setMessages(docs);
      });
  }, [props.chat, limit]);

  const styles = useChatStyle();

  return (
    <>
      <div className={clsx(`flex items-center p-4`, styles.chatContentTopBar)}>
        <Hidden mdUp>
          <IconButton onClick={props.onGoBack} style={{ marginRight: 16 }}>
            <ArrowLeft />
          </IconButton>
        </Hidden>
        <ChatAvatar chat={props.chat} />
        <Typography variant="h6" display="inline" style={{ marginLeft: 16 }}>
          <ChatName chat={props.chat} />
        </Typography>
      </div>

      {!selectedMessage?.type.startsWith('image') ? null : (
        <Lightbox
          mainSrc={selectedMessage?.mediaUrl || ''}
          onCloseRequest={() => setSelectedMessage(null)}
        />
      )}

      {props.children ? (
        props.children
      ) : (
        <div id="scrollableDiv" className={styles.chatContentScrollContainer}>
          <InfiniteScroll
            dataLength={messages.length}
            next={() => setLimit((prev) => prev + 30)}
            className={styles.chatContentInfiniteScroll}
            inverse
            hasMore
            loader={<div />}
            scrollableTarget="scrollableDiv">
            {messages.map((message) => {
              return (
                <ChatMessage
                  message={message}
                  onClick={() => setSelectedMessage(message)}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};
