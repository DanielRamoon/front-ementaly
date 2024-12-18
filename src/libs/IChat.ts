import firebase from 'firebase';
import { Moment } from 'moment';

export interface IChat {
  uuid: string;
  avatar?: string;
  ref: firebase.firestore.DocumentReference;
  lastMessage?: IChatMessage;

  members: IChatMember[];

  pendingMessages?: { [user: string]: number };
}

export interface IChatMessage {
  uuid: string;
  content: string;
  mediaUrl?: string;
  createdAt: Moment;
  createdBy: {
    name: string;
    ref: firebase.firestore.DocumentReference;
  };
  type: string;
}

interface IChatMember {
  ref: firebase.firestore.DocumentReference;
  name: string;
}
