import { createContext } from 'react';
import Firebase from './Firebase';

const FirebaseContext = createContext<Firebase>({} as Firebase);

export default FirebaseContext;
