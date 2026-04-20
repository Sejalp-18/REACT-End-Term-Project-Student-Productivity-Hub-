function StatCard({ label, value, helper }) {
  return (
    <article className="stat-card">
      <p className="muted small">{label}</p>
      <h3>{value}</h3>
      <p className="muted small">{helper}</p>
    </article>
  );
}

export default StatCard;
