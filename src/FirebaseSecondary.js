import * as OtherApp from "firebase";

const config = {
  apiKey: "AIzaSyAM41SBy8oD2QwG3QsD61DIIguAVwSlYik",
  authDomain: "timelinedemo-d0193.firebaseapp.com",
  databaseURL: "https://timelinedemo-d0193.firebaseio.com",
  projectId: "timelinedemo-d0193",
  storageBucket: "timelinedemo-d0193.appspot.com",
  messagingSenderId: "962657185492"
};

export default (!OtherApp.apps.length
  ? OtherApp.initializeApp(config)
  : OtherApp.app());
