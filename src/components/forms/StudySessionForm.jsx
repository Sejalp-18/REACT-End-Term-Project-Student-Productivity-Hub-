import { useEffect } from "react";
import { useFormFields } from "../../hooks/useFormFields";

const initialSession = {
  topic: "",
  subject: "",
  date: "",
  duration: 1,
  priority: "medium",
};

function StudySessionForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const { fields, updateField, resetFields, setAllFields } =
    useFormFields(initialSession);

  useEffect(() => {
    if (initialValues) {
      setAllFields(initialValues);
    } else {
      resetFields();
    }
  }, [initialValues, resetFields, setAllFields]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...fields, duration: Number(fields.duration) });
    resetFields();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Topic
        <input
          name="topic"
          value={fields.topic}
          onChange={updateField}
          placeholder="Practice React Context patterns"
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
          Date
          <input type="date" name="date" value={fields.date} onChange={updateField} required />
        </label>

        <label>
          Duration (hours)
          <input
            type="number"
            step="0.5"
            min="0.5"
            name="duration"
            value={fields.duration}
            onChange={updateField}
            required
          />
        </label>
      </div>

      <label>
        Priority
        <select name="priority" value={fields.priority} onChange={updateField}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
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

export default StudySessionForm;
