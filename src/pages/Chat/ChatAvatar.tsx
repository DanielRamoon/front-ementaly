import { Avatar, Badge } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';

import useAuth from '../../hooks/useAuth';
import { IChat } from '../../libs';

interface ChatAvatarProps {
  chat: IChat;
}

interface AvatarData {
  avatarUrl: string;
  isOnline: boolean;
}

export const ChatAvatar: React.FC<ChatAvatarProps> = (props) => {
  const { currentUser } = useAuth();
  const [avatarData, setAvatarData] = useState<AvatarData | undefined>(
    undefined,
  );

  const avatars = useRef(
    props.chat.members.filter((member) => member.ref.id !== currentUser?.uuid),
  );

  useEffect(() => {
    if (avatars.current.length === 1) {
      const unsubscribe = avatars.current[0].ref.onSnapshot((user) => {
        if (!user.exists) {
          return;
        }

        const data = user.data();

        if (data) {
          setAvatarData({
            avatarUrl: data.avatar,
            isOnline: data.online,
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }

    return () => {};
  }, [avatars]);

  if (props.chat.avatar) {
    return <Avatar src={props.chat.avatar} />;
  }

  if (avatars.current.length === 1) {
    return (
      <Badge variant="dot" color={avatarData?.isOnline ? 'primary' : 'error'}>
        <Avatar src={avatarData?.avatarUrl} />
      </Badge>
    );
  }

  return null;
};
