import EmptyState from "../common/EmptyState";

function StudySessionList({ studySessions, onEdit, onDelete }) {
  if (!studySessions.length) {
    return (
      <EmptyState
        title="No study sessions planned"
        description="Add a study block to shape your weekly focus plan."
      />
    );
  }

  return (
    <div className="card-list">
      {studySessions.map((session) => (
        <article key={session.id} className="item-card">
          <div className="item-card-header">
            <div>
              <h3>{session.topic}</h3>
              <p className="muted">
                {session.subject} • {session.date}
              </p>
            </div>
            <span className={`pill ${session.priority}`}>{session.priority}</span>
          </div>

          <p className="muted">Duration: {session.duration} hour(s)</p>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={() => onEdit(session)}>
              Edit
            </button>
            <button type="button" className="ghost-button" onClick={() => onDelete(session.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default StudySessionList;
