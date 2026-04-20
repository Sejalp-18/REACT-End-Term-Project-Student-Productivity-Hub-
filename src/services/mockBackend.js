const USERS_KEY = "student-hub-users";
const SESSION_KEY = "student-hub-session";
const DATA_KEY = "student-hub-data";

export const seedAssignments = [
  {
    id: "a1",
    title: "React Router Reflection",
    subject: "Frontend Engineering",
    deadline: "2026-04-24",
    priority: "high",
    status: "in-progress",
    notes: "Document protected route flow and lazy loading decisions.",
  },
  {
    id: "a2",
    title: "Database Modeling Worksheet",
    subject: "Backend Systems",
    deadline: "2026-04-27",
    priority: "medium",
    status: "todo",
    notes: "Revise relationships before lab submission.",
  },
];

export const seedSessions = [
  {
    id: "s1",
    topic: "React hooks recap",
    subject: "Frontend Engineering",
    date: "2026-04-19",
    duration: 2,
    priority: "high",
  },
  {
    id: "s2",
    topic: "SQL joins practice",
    subject: "Backend Systems",
    date: "2026-04-20",
    duration: 1.5,
    priority: "medium",
  },
];

function wait(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 150);
  });
}

function readJSON(key, fallback) {
  const rawValue = window.localStorage.getItem(key);
  return rawValue ? JSON.parse(rawValue) : fallback;
}

function writeJSON(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function bootstrapUserData(userId) {
  const allData = readJSON(DATA_KEY, {});
  if (!allData[userId]) {
    allData[userId] = {
      assignments: seedAssignments.map((assignment) => ({ ...assignment })),
      studySessions: seedSessions.map((session) => ({ ...session })),
    };
    writeJSON(DATA_KEY, allData);
  }
}

export function getStoredSession() {
  return readJSON(SESSION_KEY, null);
}

export async function registerUser({ name, email, password }) {
  const users = readJSON(USERS_KEY, []);
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const nextUser = {
    id: uid("user"),
    name,
    email,
    password,
  };

  users.push(nextUser);
  writeJSON(USERS_KEY, users);

  const sessionUser = {
    id: nextUser.id,
    name: nextUser.name,
    email: nextUser.email,
  };

  writeJSON(SESSION_KEY, sessionUser);
  bootstrapUserData(nextUser.id);
  return wait(sessionUser);
}

export async function loginUser({ email, password }) {
  const users = readJSON(USERS_KEY, []);
  const matchedUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (!matchedUser) {
    throw new Error("Invalid credentials. Try the demo account after signing up.");
  }

  const sessionUser = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
  };

  writeJSON(SESSION_KEY, sessionUser);
  bootstrapUserData(sessionUser.id);
  return wait(sessionUser);
}

export async function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY);
  return wait(true);
}

export async function getUserProductivityData(userId) {
  bootstrapUserData(userId);
  const allData = readJSON(DATA_KEY, {});
  return wait(allData[userId]);
}

export async function createAssignment(userId, payload) {
  const allData = readJSON(DATA_KEY, {});
  const nextAssignment = { id: uid("assignment"), ...payload };
  allData[userId].assignments = [nextAssignment, ...allData[userId].assignments];
  writeJSON(DATA_KEY, allData);
  return wait(nextAssignment);
}

export async function updateAssignment(userId, assignmentId, payload) {
  const allData = readJSON(DATA_KEY, {});
  let updatedAssignment = null;

  allData[userId].assignments = allData[userId].assignments.map((assignment) => {
    if (assignment.id !== assignmentId) {
      return assignment;
    }

    updatedAssignment = { ...assignment, ...payload };
    return updatedAssignment;
  });

  writeJSON(DATA_KEY, allData);
  return wait(updatedAssignment);
}

export async function deleteAssignment(userId, assignmentId) {
  const allData = readJSON(DATA_KEY, {});
  allData[userId].assignments = allData[userId].assignments.filter(
    (assignment) => assignment.id !== assignmentId
  );
  writeJSON(DATA_KEY, allData);
  return wait(true);
}

export async function createStudySession(userId, payload) {
  const allData = readJSON(DATA_KEY, {});
  const nextSession = { id: uid("session"), ...payload };
  allData[userId].studySessions = [nextSession, ...allData[userId].studySessions];
  writeJSON(DATA_KEY, allData);
  return wait(nextSession);
}

export async function updateStudySession(userId, sessionId, payload) {
  const allData = readJSON(DATA_KEY, {});
  let updatedSession = null;

  allData[userId].studySessions = allData[userId].studySessions.map((session) => {
    if (session.id !== sessionId) {
      return session;
    }

    updatedSession = { ...session, ...payload };
    return updatedSession;
  });

  writeJSON(DATA_KEY, allData);
  return wait(updatedSession);
}

export async function deleteStudySession(userId, sessionId) {
  const allData = readJSON(DATA_KEY, {});
  allData[userId].studySessions = allData[userId].studySessions.filter(
    (session) => session.id !== sessionId
  );
  writeJSON(DATA_KEY, allData);
  return wait(true);
}
