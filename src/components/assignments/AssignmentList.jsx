import EmptyState from "../common/EmptyState";

function AssignmentList({ assignments, onEdit, onDelete, onQuickStatus }) {
  if (!assignments.length) {
    return (
      <EmptyState
        title="No assignments added"
        description="Create your first task to start tracking deadlines and progress."
      />
    );
  }

  return (
    <div className="card-list">
      {assignments.map((assignment) => (
        <article key={assignment.id} className="item-card">
          <div className="item-card-header">
            <div>
              <h3>{assignment.title}</h3>
              <p className="muted">
                {assignment.subject} • Due {assignment.deadline}
              </p>
            </div>
            <span className={`pill ${assignment.priority}`}>{assignment.priority}</span>
          </div>

          <p>{assignment.notes}</p>

          <div className="item-card-footer">
            <select
              value={assignment.status}
              onChange={(event) => onQuickStatus(assignment.id, event.target.value)}
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>

            <div className="button-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onEdit(assignment)}
              >
                Edit
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => onDelete(assignment.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default AssignmentList;
