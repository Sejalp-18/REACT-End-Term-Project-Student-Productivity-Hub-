import { useState } from "react";
import StudySessionForm from "../components/forms/StudySessionForm";
import StudySessionList from "../components/planner/StudySessionList";
import { useData } from "../context/DataContext";

function PlannerPage() {
  const { studySessions, addStudySession, editStudySession, removeStudySession } = useData();
  const [editingSession, setEditingSession] = useState(null);

  async function handleSubmit(payload) {
    if (editingSession) {
      await editStudySession(editingSession.id, payload);
      setEditingSession(null);
      return;
    }

    await addStudySession(payload);
  }

  return (
    <div className="page-stack two-panel-layout">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Study planner</p>
            <h2>{editingSession ? "Edit study session" : "Plan a study block"}</h2>
          </div>
        </div>

        <StudySessionForm
          initialValues={editingSession}
          onSubmit={handleSubmit}
          onCancel={editingSession ? () => setEditingSession(null) : null}
          submitLabel={editingSession ? "Update session" : "Add session"}
        />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Weekly sessions</p>
            <h2>Your planned study blocks</h2>
          </div>
        </div>

        <StudySessionList
          studySessions={studySessions}
          onEdit={setEditingSession}
          onDelete={removeStudySession}
        />
      </section>
    </div>
  );
}

export default PlannerPage;
