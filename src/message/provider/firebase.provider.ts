import * as config from 'config';
import * as firebase from 'firebase-admin';
import { DICTIONARY } from '../constant/dictionary.constant';

export const FirebaseProvider = {
  provide: DICTIONARY.FIREBASE,
  useFactory: () => {
    firebase.initializeApp({
      credential: firebase.credential.cert(config.get('firebase.accountKey')),
    });

    return firebase;
  },
};
