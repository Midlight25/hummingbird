import { getAuth, connectAuthEmulator } from 'firebase/auth';
import app from './app';

const auth = getAuth(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'https://localhost:9099');
}

export default auth;
