import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  createAssignment,
  createStudySession,
  deleteAssignment,
  deleteStudySession,
  getUserProductivityData,
  seedUserData,
  updateAssignment,
  updateStudySession,
} from "../services/dataService";
import { seedAssignments, seedSessions } from "../services/mockBackend";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) {
      setAssignments([]);
      setStudySessions([]);
      return;
    }

    setLoading(true);

    try {
      await seedUserData(user.id, {
        assignments: seedAssignments,
        studySessions: seedSessions,
      });
      const data = await getUserProductivityData(user.id);
      setAssignments(data.assignments);
      setStudySessions(data.studySessions);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addAssignment = useCallback(
    async (payload) => {
      const nextAssignment = await createAssignment(user.id, payload);
      setAssignments((current) => [nextAssignment, ...current]);
    },
    [user]
  );

  const editAssignment = useCallback(
    async (assignmentId, payload) => {
      const nextAssignment = await updateAssignment(user.id, assignmentId, payload);
      setAssignments((current) =>
        current.map((item) =>
          item.id === assignmentId ? { ...item, ...nextAssignment } : item
        )
      );
    },
    [user]
  );

  const removeAssignment = useCallback(
    async (assignmentId) => {
      await deleteAssignment(user.id, assignmentId);
      setAssignments((current) => current.filter((item) => item.id !== assignmentId));
    },
    [user]
  );

  const addStudySession = useCallback(
    async (payload) => {
      const nextSession = await createStudySession(user.id, payload);
      setStudySessions((current) => [nextSession, ...current]);
    },
    [user]
  );

  const editStudySession = useCallback(
    async (sessionId, payload) => {
      const nextSession = await updateStudySession(user.id, sessionId, payload);
      setStudySessions((current) =>
        current.map((item) => (item.id === sessionId ? { ...item, ...nextSession } : item))
      );
    },
    [user]
  );

  const removeStudySession = useCallback(
    async (sessionId) => {
      await deleteStudySession(user.id, sessionId);
      setStudySessions((current) => current.filter((item) => item.id !== sessionId));
    },
    [user]
  );

  const analytics = useMemo(() => {
    const completedAssignments = assignments.filter(
      (assignment) => assignment.status === "done"
    ).length;
    const overdueAssignments = assignments.filter(
      (assignment) =>
        assignment.status !== "done" && new Date(assignment.deadline) < new Date()
    ).length;

    const subjectMap = assignments.reduce((accumulator, assignment) => {
      const subject = assignment.subject || "General";
      const current = accumulator[subject] || { subject, completed: 0, pending: 0 };

      if (assignment.status === "done") {
        current.completed += 1;
      } else {
        current.pending += 1;
      }

      accumulator[subject] = current;
      return accumulator;
    }, {});

    const studyHoursByDay = studySessions.reduce((accumulator, session) => {
      const day = new Date(session.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const current = accumulator[day] || { day, hours: 0 };
      current.hours += Number(session.duration);
      accumulator[day] = current;
      return accumulator;
    }, {});

    return {
      completedAssignments,
      overdueAssignments,
      completionRate: assignments.length
        ? Math.round((completedAssignments / assignments.length) * 100)
        : 0,
      subjectBreakdown: Object.values(subjectMap),
      studyHoursByDay: Object.values(studyHoursByDay),
    };
  }, [assignments, studySessions]);

  const value = useMemo(
    () => ({
      assignments,
      studySessions,
      analytics,
      loading,
      addAssignment,
      editAssignment,
      removeAssignment,
      addStudySession,
      editStudySession,
      removeStudySession,
      refreshData: loadData,
    }),
    [
      addAssignment,
      addStudySession,
      analytics,
      assignments,
      editAssignment,
      editStudySession,
      loadData,
      loading,
      removeAssignment,
      removeStudySession,
      studySessions,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }

  return context;
}
