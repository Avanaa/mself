const admin = require('firebase-admin');
const serviceAccountKey = require('../admin/config.json');

admin.initializeApp({
    credential : admin.credential.cert(serviceAccountKey),
    databaseURL : 'https://mself-1243c.firebaseio.com/',
    storageBucket : 'gs://mself-1243c.appspot.com'
});

let database = admin.database().ref();
let storage = admin.storage().bucket();
let message = admin.messaging();

let FirebaseReference = {
    DatabaseReference : database,
    StorageReference : storage,
    MessageReference : message
};

module.exports = FirebaseReference;