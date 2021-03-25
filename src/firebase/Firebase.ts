import firebase from 'firebase/app';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: 'AIzaSyAsJ0Rbs5It01A1RTY61ERO44KO0DjrpqQ',
    authDomain: 'split-bill-app.firebaseapp.com',
    projectId: 'split-bill-app',
    storageBucket: 'split-bill-app.appspot.com',
    messagingSenderId: '33643061571',
    appId: '1:33643061571:web:d4526a1cd30774c8cc4ff6',
};

export default class Firebase {
    public functions: firebase.functions.Functions;
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.functions = firebase.functions();
    }
}
