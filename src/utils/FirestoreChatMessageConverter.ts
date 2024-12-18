import firebase from 'firebase';
import Moment from 'moment';

import { IChatMessage } from '../libs';

export const FirestoreChatMessageConverter: firebase.firestore.FirestoreDataConverter<IChatMessage> = {
  toFirestore: () => {
    return {};
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();

    return {
      uuid: snapshot.id,
      content: data.content,
      mediaUrl: data.mediaUrl,
      createdAt: !data.createdAt ? Moment() : Moment(data.createdAt.toDate()),
      createdBy: data.createdBy,
      type: data.type,
    };
  },
};
