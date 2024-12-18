import { ButtonBase, Typography } from '@material-ui/core';
import clsx from 'clsx';
import FileDownload from 'js-file-download';
import { FileOutline } from 'mdi-material-ui';
import React from 'react';
import { useIntl } from 'react-intl';

import useAuth from '../../hooks/useAuth';
import { IChatMessage } from '../../libs';
import { useChatStyle } from './useChatStyle';

interface ChatMessageProps {
  message: IChatMessage;

  // eslint-disable-next-line react/require-default-props,react/no-unused-prop-types
  onClick?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const { currentUser } = useAuth();

  const isMine = props.message.createdBy.ref.id === currentUser?.uuid;

  const styles = useChatStyle();

  let MessageElement = null;

  if (props.message.type === 'text') {
    MessageElement = <TextMessage {...props} />;
  } else if (props.message.type.startsWith('image')) {
    MessageElement = <ImageMessage {...props} />;
  } else {
    MessageElement = <MediaMessage {...props} />;
  }

  return (
    <div
      className={clsx('flex mb-4', {
        'justify-end': isMine,
      })}>
      <div
        className={clsx(`px-4 py-2 rounded-lg`, {
          [styles.messageByCurrentUser]: isMine,
          [styles.messageByOtherUser]: !isMine,
        })}>
        {MessageElement}

        <Typography variant="caption">
          {props.message.createdAt.isSame(undefined, 'day')
            ? props.message.createdAt.format('HH[h]mm')
            : props.message.createdAt.format('DD/MM/YYYY [às] HH[h]mm')}
        </Typography>
      </div>
    </div>
  );
};

const TextMessage: React.FC<ChatMessageProps> = (props: ChatMessageProps) => {
  return (
    <>
      <Typography gutterBottom>{props.message.content}</Typography>
    </>
  );
};

const ImageMessage: React.FC<ChatMessageProps> = (props: ChatMessageProps) => {
  return (
    <div className="mb-4">
      <ButtonBase onClick={props.onClick}>
        <img
          src={props.message.mediaUrl}
          alt=""
          width={296}
          height={296}
          className="rounded-md"
        />
      </ButtonBase>
    </div>
  );
};

const MediaMessage: React.FC<ChatMessageProps> = (props: ChatMessageProps) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-2">
      <ButtonBase
        style={{ justifyContent: 'flex-start', textAlign: 'left' }}
        onClick={() => {
          if (!props.message.mediaUrl) return;

          window.open(props.message.mediaUrl, '_blank');
        }}>
        <div
          className="flex p-2 rounded-md"
          style={{ backgroundColor: 'rgba(255, 255, 255, .3)' }}>
          <FileOutline />
          <div className="flex-1 ml-4 mr-4">
            <Typography>{props.message.content}</Typography>
            <Typography variant="caption">
              {formatMessage({ id: 'chatMessage.downloadMedia' })}
            </Typography>
          </div>
        </div>
      </ButtonBase>
    </div>
  );
};
