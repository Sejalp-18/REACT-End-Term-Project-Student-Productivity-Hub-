import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormFields } from "../../hooks/useFormFields";

const authContent = {
  login: {
    title: "Welcome back",
    subtitle: "Pick up where you left off and stay on top of every deadline.",
    action: "Sign in",
    linkLabel: "Create account",
    linkTo: "/signup",
  },
  signup: {
    title: "Create your workspace",
    subtitle: "Build a study system that tracks classes, assignments, and focused practice.",
    action: "Create account",
    linkLabel: "Already have an account?",
    linkTo: "/login",
  },
};

function AuthForm({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const firstInputRef = useRef(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { fields, updateField } = useFormFields({
    name: "",
    email: "",
    password: "",
  });

  const content = authContent[mode];

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "signup") {
        await signUp(fields);
      } else {
        await signIn(fields);
      }

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
      firstInputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <p className="eyebrow">Batch 2029 Project</p>
        <h1>Student Productivity Hub</h1>
        <p>
          Organize academics in one place with assignment tracking, study planning,
          and progress visibility.
        </p>
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <div>
            <h2>{content.title}</h2>
            <p className="muted">{content.subtitle}</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label>
              Full name
              <input
                ref={firstInputRef}
                name="name"
                value={fields.name}
                onChange={updateField}
                placeholder="Sejal Sharma"
                required
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              ref={mode === "login" ? firstInputRef : null}
              type="email"
              name="email"
              value={fields.email}
              onChange={updateField}
              placeholder="student@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={fields.password}
              onChange={updateField}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Please wait..." : content.action}
          </button>
        </form>

        <p className="muted small">
          <Link to={content.linkTo}>{content.linkLabel}</Link>
        </p>
      </section>
    </div>
  );
}

export default AuthForm;
