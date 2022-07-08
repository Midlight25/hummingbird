import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const db = getFirestore();

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default db;
