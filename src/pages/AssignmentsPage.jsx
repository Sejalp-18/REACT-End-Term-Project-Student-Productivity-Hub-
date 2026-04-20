import { useCallback, useMemo, useState } from "react";
import AssignmentList from "../components/assignments/AssignmentList";
import AssignmentForm from "../components/forms/AssignmentForm";
import { useData } from "../context/DataContext";

function AssignmentsPage() {
  const { assignments, addAssignment, editAssignment, removeAssignment } = useData();
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssignments = useMemo(() => {
    if (statusFilter === "all") {
      return assignments;
    }

    return assignments.filter((assignment) => assignment.status === statusFilter);
  }, [assignments, statusFilter]);

  const handleSubmit = useCallback(
    async (payload) => {
      if (editingAssignment) {
        await editAssignment(editingAssignment.id, payload);
        setEditingAssignment(null);
        return;
      }

      await addAssignment(payload);
    },
    [addAssignment, editAssignment, editingAssignment]
  );

  const handleQuickStatus = useCallback(
    async (assignmentId, status) => {
      await editAssignment(assignmentId, { status });
    },
    [editAssignment]
  );

  return (
    <div className="page-stack two-panel-layout">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Assignment manager</p>
            <h2>{editingAssignment ? "Edit assignment" : "Create assignment"}</h2>
          </div>
        </div>
        <AssignmentForm
          initialValues={editingAssignment}
          onSubmit={handleSubmit}
          onCancel={editingAssignment ? () => setEditingAssignment(null) : null}
          submitLabel={editingAssignment ? "Update assignment" : "Add assignment"}
        />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Task board</p>
            <h2>All assignments</h2>
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <AssignmentList
          assignments={filteredAssignments}
          onEdit={setEditingAssignment}
          onDelete={removeAssignment}
          onQuickStatus={handleQuickStatus}
        />
      </section>
    </div>
  );
}

export default AssignmentsPage;
