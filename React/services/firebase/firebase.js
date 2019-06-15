// This file demonstrates a clean, composable way to expose Firebase SDK to a React project.
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

// Firebase config is totally public info. I've seen too many attempts to hide it or encrypt it... enjoy.
const config = {
  apiKey: 'AIzaSyCdBwAhsJbVkUdwxo7zTQ2jCWlXop45aEw',
  authDomain: 'caregiver-go.firebaseapp.com',
  databaseURL: 'https://caregiver-go.firebaseio.com',
  projectId: 'caregiver-go',
  storageBucket: 'caregiver-go.appspot.com',
  messagingSenderId: '124459082115',
  appId: '1:124459082115:web:e34c48032da0c5ed',
};

export const app = firebase.initializeApp(config);

export const rtdb = firebase.database();
export const fsdb = firebase.firestore();
export const fbAuth = firebase.auth;
export const auth = firebase.auth();
export const storage = firebase.storage();

/**
 * Populates server-side timestamp for Firestore document properties
 * Works a little different from what may be expected so check the docs
 */
export const fsServerTimestamp = firebase.firestore.FieldValue.serverTimestamp();

/**
 * Just a type that contains useful methods to work with Firestore timestamp. Look at the docs...
 */
export const fsTimestamp = firebase.firestore.Timestamp;

/**
 * Populates server-side timestamp for realtime database values
 * Standard old-school POJO date (milliseconds since Unix epoch)
 */
export const rtTimestamp = firebase.database.ServerValue.TIMESTAMP;
