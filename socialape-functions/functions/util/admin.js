const admin = require("firebase-admin");
const { firebaseConfig, adminConfig } = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(adminConfig),
  storageBucket: "socialape-2e522.appspot.com"
});

// const firebase = require("firebase");
// firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

module.exports = { admin, db };
