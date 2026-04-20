import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assignments", label: "Assignments" },
  { to: "/planner", label: "Study Planner" },
];

function AppShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Student Productivity Hub</p>
          <h1>Focus better, finish faster.</h1>
          <p className="muted">
            A personal command center for classes, deadlines, and intentional study.
          </p>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <div>
            <p className="muted small">Signed in as</p>
            <strong>{user?.name}</strong>
            <p className="muted small">{user?.email}</p>
          </div>
          <button type="button" className="secondary-button" onClick={signOut}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
