import { getStorage, connectStorageEmulator } from 'firebase/storage';
import app from './app';

const storage = getStorage(app);

if (import.meta.env.DEV) {
  connectStorageEmulator(storage, 'localhost', 9199);
}

export default storage;
