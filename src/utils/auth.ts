import { getAuth, connectAuthEmulator } from 'firebase/auth';

const auth = getAuth();

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'https://localhost:9099');
}

export default auth;
