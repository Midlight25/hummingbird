import { getStorage, connectStorageEmulator } from 'firebase/storage';

const storage = getStorage();

if (import.meta.env.DEV) {
  connectStorageEmulator(storage, 'localhost', 9199);
}

export default storage;
