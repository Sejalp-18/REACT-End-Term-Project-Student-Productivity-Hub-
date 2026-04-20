import ChartsPanel from "../components/dashboard/ChartsPanel";
import StatCard from "../components/dashboard/StatCard";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { isFirebaseConfigured } from "../services/firebase";

function DashboardPage() {
  const { user } = useAuth();
  const { assignments, studySessions, analytics } = useData();
  const firstName = user?.name ? user.name.split(" ")[0] : "Student";

  const upcomingAssignments = assignments
    .slice()
    .sort((left, right) => new Date(left.deadline) - new Date(right.deadline))
    .slice(0, 3);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Hello, {firstName}</h2>
          <p className="muted">
            Track what matters this week: deadlines, study intensity, and consistent
            follow-through.
          </p>
        </div>
        {!isFirebaseConfigured ? (
          <div className="notice-card">
            Demo mode is active with local persistence. Add Firebase env keys when you
            want real backend auth and database integration.
          </div>
        ) : null}
      </section>

      <section className="stats-grid">
        <StatCard
          label="Assignments"
          value={assignments.length}
          helper="All current academic tasks"
        />
        <StatCard
          label="Completion rate"
          value={`${analytics.completionRate}%`}
          helper="Tasks marked done"
        />
        <StatCard
          label="Overdue"
          value={analytics.overdueAssignments}
          helper="Items needing immediate attention"
        />
        <StatCard
          label="Study sessions"
          value={studySessions.length}
          helper="Planned focused work blocks"
        />
      </section>

      <ChartsPanel
        subjectBreakdown={analytics.subjectBreakdown}
        studyHoursByDay={analytics.studyHoursByDay}
      />

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Next up</p>
            <h2>Upcoming deadlines</h2>
          </div>
        </div>
        <div className="card-list compact">
          {upcomingAssignments.map((assignment) => (
            <article key={assignment.id} className="item-card">
              <h3>{assignment.title}</h3>
              <p className="muted">
                {assignment.subject} • {assignment.deadline}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
