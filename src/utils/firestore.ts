import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import app from './app';

const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default db;
