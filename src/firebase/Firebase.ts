import firebase from 'firebase/app';
import 'firebase/functions';
import { FirebaseConfig } from '../config';

const firebaseConfig = FirebaseConfig;

export default class Firebase {
    public functions: firebase.functions.Functions;
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.functions = firebase.functions();
    }
}
