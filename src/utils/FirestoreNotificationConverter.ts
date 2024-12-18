import firebase from 'firebase';
import Moment from 'moment';

import { INotification } from '../libs';

export const FirestoreNotificationConverter: firebase.firestore.FirestoreDataConverter<INotification> = {
  toFirestore: () => {
    return {};
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();

    return {
      uuid: snapshot.id,
      title: data.title,
      description: data.description,
      createdAt: Moment(data.createdAt.toDate()),
    };
  },
};
