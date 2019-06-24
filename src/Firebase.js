import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyAM41SBy8oD2QwG3QsD61DIIguAVwSlYik",
  authDomain: "timelinedemo-d0193.firebaseapp.com",
  databaseURL: "https://timelinedemo-d0193.firebaseio.com",
  projectId: "timelinedemo-d0193",
  storageBucket: "timelinedemo-d0193.appspot.com",
  messagingSenderId: "962657185492",
  appId: "1:962657185492:web:9fe9bd05e586095d"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
