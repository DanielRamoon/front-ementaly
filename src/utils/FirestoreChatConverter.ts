import firebase from 'firebase';
import Moment from 'moment';

import { IChat } from '../libs';

export const FirestoreChatConverter: firebase.firestore.FirestoreDataConverter<IChat> = {
  toFirestore: () => {
    return {};
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();

    return {
      uuid: snapshot.id,
      avatar: data.avatar,
      ref: firebase.firestore().doc(snapshot.ref.path),
      members: data.membersMetadata,
      lastMessage: !data.lastMessage
        ? undefined
        : {
            ...data.lastMessage,
            createdAt: Moment(data.lastMessage.createdAt.toDate()),
          },
      pendingMessages: data.pendingMessages,
    };
  },
};
