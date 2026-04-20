import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";
import {
  getStoredSession,
  loginUser,
  logoutUser,
  registerUser,
} from "./mockBackend";

function mapFirebaseUser(user, profile = null) {
  return {
    id: user.uid,
    name: profile?.name || user.displayName || "Student",
    email: profile?.email || user.email || "",
  };
}

async function ensureUserProfile(user, fallbackName) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const profile = {
      name: fallbackName || user.displayName || "Student",
      email: user.email || "",
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, profile);
    return profile;
  }

  return snapshot.data();
}

export async function registerWithAuth({ name, email, password }) {
  if (!isFirebaseConfigured) {
    return registerUser({ name, email, password });
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  const profile = await ensureUserProfile(credential.user, name);
  return mapFirebaseUser(credential.user, profile);
}

export async function loginWithAuth({ email, password }) {
  if (!isFirebaseConfigured) {
    return loginUser({ email, password });
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await ensureUserProfile(credential.user);
  return mapFirebaseUser(credential.user, profile);
}

export async function logoutFromAuth() {
  if (!isFirebaseConfigured) {
    return logoutUser();
  }

  await signOut(auth);
  return true;
}

export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured) {
    callback(getStoredSession());
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    const profile = await ensureUserProfile(user);
    callback(mapFirebaseUser(user, profile));
  });
}
