import { IconButton, InputBase } from '@material-ui/core';
import firebase from 'firebase';
import { Send } from 'mdi-material-ui';
import React, { useRef, useState } from 'react';

import useAuth from '../../hooks/useAuth';
import { IChat } from '../../libs';

interface ChatTextInputProps {
  chat: IChat;
}

export const ChatTextInput: React.FC<ChatTextInputProps> = (props) => {
  const [text, setText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const { getFirestoreRef, currentUser } = useAuth();

  const inputRef = useRef<HTMLInputElement>();

  const onSubmit = async (): Promise<void> => {
    try {
      setSubmitting(true);

      await props.chat.ref.collection('messages').add({
        content: text,
        type: 'text',
        createdBy: {
          name: currentUser?.name || '',
          ref: getFirestoreRef(),
        },
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setText('');
    } catch (error) {
      // TODO add error message
      console.log('Error: ', error);
    } finally {
      setSubmitting(false);

      inputRef.current?.focus();
    }
  };

  return (
    <>
      <div className="flex-1 px-4 py-2 mx-2 bg-white rounded-sm">
        <InputBase
          inputRef={inputRef}
          placeholder="Digite uma mensagem..."
          value={text}
          autoFocus={!isSubmitting}
          disabled={isSubmitting}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key.toLowerCase() === 'enter') {
              onSubmit();
            }
          }}
          fullWidth
        />
      </div>
      <IconButton
        id="sendMessage"
        disabled={!text || isSubmitting}
        onClick={onSubmit}>
        <Send />
      </IconButton>
    </>
  );
};
