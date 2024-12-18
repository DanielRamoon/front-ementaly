import { IconButton } from '@material-ui/core';
import firebase from 'firebase';
import { Paperclip } from 'mdi-material-ui';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { S3Api } from '../../apis';
import useAuth from '../../hooks/useAuth';
import { IChat, SignFileResources } from '../../libs';

interface ChatFileInputProps {
  chat: IChat;
}

export const ChatFileInput: React.FC<ChatFileInputProps> = (props) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const { getFirestoreRef, currentUser } = useAuth();

  const { formatMessage } = useIntl();

  const onSubmit = async (files: FileList | null): Promise<void> => {
    try {
      setSubmitting(true);

      if (!files?.length) return;

      const fileUploadPromises = Array.from(files).map((file) => {
        return S3Api.upload({
          file,
          signature: {
            fileType: file.type,
            prefix: props.chat.uuid,
            resource: SignFileResources.chatMessage,
          },
        });
      });

      const uploadedFiles = await Promise.all(fileUploadPromises);

      const chatMessagesPromises = uploadedFiles.map((uploadedFile) => {
        return props.chat.ref.collection('messages').add({
          content: uploadedFile.name,
          mediaUrl: uploadedFile.publicUrl,
          type: uploadedFile.fileType,
          createdBy: {
            name: currentUser?.name || '',
            ref: getFirestoreRef(),
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });

      await Promise.all(chatMessagesPromises);
    } catch {
      toast.error(formatMessage({ id: 'chatFileInput.uploadError' }), {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        id="selectedFiles"
        type="file"
        onChange={async (event) => onSubmit(event.target.files)}
      />
      <label htmlFor="selectedFiles">
        <IconButton component="span" disabled={isSubmitting}>
          <Paperclip />
        </IconButton>
      </label>
    </>
  );
};
