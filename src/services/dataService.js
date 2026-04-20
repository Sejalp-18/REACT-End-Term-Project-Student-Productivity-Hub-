import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import {
  createAssignment as createMockAssignment,
  createStudySession as createMockStudySession,
  deleteAssignment as deleteMockAssignment,
  deleteStudySession as deleteMockStudySession,
  getUserProductivityData as getMockUserProductivityData,
  updateAssignment as updateMockAssignment,
  updateStudySession as updateMockStudySession,
} from "./mockBackend";

function mapDoc(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
  };
}

function sortByDate(items, fieldName) {
  return items.slice().sort((left, right) => {
    const leftDate = new Date(left[fieldName] || left.createdAt || 0).getTime();
    const rightDate = new Date(right[fieldName] || right.createdAt || 0).getTime();
    return leftDate - rightDate;
  });
}

function sortNewestFirst(items) {
  return items.slice().sort((left, right) => {
    const leftDate = new Date(left.createdAt || 0).getTime();
    const rightDate = new Date(right.createdAt || 0).getTime();
    return rightDate - leftDate;
  });
}

export async function getUserProductivityData(userId) {
  if (!isFirebaseConfigured) {
    return getMockUserProductivityData(userId);
  }

  const assignmentsRef = collection(db, "users", userId, "assignments");
  const studySessionsRef = collection(db, "users", userId, "studySessions");
  const [assignmentSnapshots, studySessionSnapshots] = await Promise.all([
    getDocs(assignmentsRef),
    getDocs(studySessionsRef),
  ]);

  const assignments = sortByDate(
    assignmentSnapshots.docs.map(mapDoc),
    "deadline"
  );
  const studySessions = sortNewestFirst(studySessionSnapshots.docs.map(mapDoc));

  return { assignments, studySessions };
}

export async function createAssignment(userId, payload) {
  if (!isFirebaseConfigured) {
    return createMockAssignment(userId, payload);
  }

  const assignmentsRef = collection(db, "users", userId, "assignments");
  const docRef = await addDoc(assignmentsRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...payload };
}

export async function updateAssignment(userId, assignmentId, payload) {
  if (!isFirebaseConfigured) {
    return updateMockAssignment(userId, assignmentId, payload);
  }

  const assignmentRef = doc(db, "users", userId, "assignments", assignmentId);
  await updateDoc(assignmentRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: assignmentId, ...payload };
}

export async function deleteAssignment(userId, assignmentId) {
  if (!isFirebaseConfigured) {
    return deleteMockAssignment(userId, assignmentId);
  }

  const assignmentRef = doc(db, "users", userId, "assignments", assignmentId);
  await deleteDoc(assignmentRef);
  return true;
}

export async function createStudySession(userId, payload) {
  if (!isFirebaseConfigured) {
    return createMockStudySession(userId, payload);
  }

  const studySessionsRef = collection(db, "users", userId, "studySessions");
  const docRef = await addDoc(studySessionsRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...payload };
}

export async function updateStudySession(userId, sessionId, payload) {
  if (!isFirebaseConfigured) {
    return updateMockStudySession(userId, sessionId, payload);
  }

  const sessionRef = doc(db, "users", userId, "studySessions", sessionId);
  await updateDoc(sessionRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: sessionId, ...payload };
}

export async function deleteStudySession(userId, sessionId) {
  if (!isFirebaseConfigured) {
    return deleteMockStudySession(userId, sessionId);
  }

  const sessionRef = doc(db, "users", userId, "studySessions", sessionId);
  await deleteDoc(sessionRef);
  return true;
}

export async function seedUserData(userId, seedData) {
  if (!isFirebaseConfigured) {
    return true;
  }

  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { hasSeededDemoData: true }, { merge: true });

  const currentData = await getUserProductivityData(userId);
  if (currentData.assignments.length || currentData.studySessions.length) {
    return true;
  }

  await Promise.all(
    seedData.assignments.map((assignment) => createAssignment(userId, assignment))
  );
  await Promise.all(
    seedData.studySessions.map((session) => createStudySession(userId, session))
  );

  return true;
}
