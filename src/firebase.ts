import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/message";

const firebaseConfig = {
  apiKey: "AIzaSyC4jHLgRxJFSfhFjdWq3cFD7qx4L8nGJsE",
  authDomain: "wmmns-549d4.firebaseapp.com",
  projectId: "wmmns-549d4",
  storageBucket: "wmmns-549d4.appspot.com",
  messagingSenderId: "1049636169868",
  appId: "1:1049636169868:web:8226d4c2aebded80cf33a9",
  measurementId: "G-3ZGD4TEGB7",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BGa771P7D67WUDvmAnNAHj3vekkciRifrrswG4S1QRL0Xqd0dqgqrYIScnFJOtCLbygRBKQBUxaTshI22xmTnyQ" })
    .then((currentToken: any) => {
      if (currentToken) {
        console.log("FCM Token:", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err: any) => {
      console.error("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
