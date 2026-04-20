import { useEffect } from "react";
import { useFormFields } from "../../hooks/useFormFields";

const initialAssignment = {
  title: "",
  subject: "",
  deadline: "",
  priority: "medium",
  status: "todo",
  notes: "",
};

function AssignmentForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const { fields, updateField, resetFields, setAllFields } =
    useFormFields(initialAssignment);

  useEffect(() => {
    if (initialValues) {
      setAllFields(initialValues);
    } else {
      resetFields();
    }
  }, [initialValues, resetFields, setAllFields]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(fields);
    resetFields();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Assignment title
        <input
          name="title"
          value={fields.title}
          onChange={updateField}
          placeholder="Finish React hooks report"
          required
        />
      </label>

      <label>
        Subject
        <input
          name="subject"
          value={fields.subject}
          onChange={updateField}
          placeholder="Frontend Engineering"
          required
        />
      </label>

      <div className="two-column-grid">
        <label>
          Deadline
          <input
            type="date"
            name="deadline"
            value={fields.deadline}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Priority
          <select name="priority" value={fields.priority} onChange={updateField}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <label>
        Status
        <select name="status" value={fields.status} onChange={updateField}>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={fields.notes}
          onChange={updateField}
          rows="4"
          placeholder="Add submission details, dependencies, or revision notes."
        />
      </label>

      <div className="button-row">
        <button type="submit" className="primary-button">
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default AssignmentForm;
