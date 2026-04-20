import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import EmptyState from "../common/EmptyState";

const palette = ["#0f766e", "#f97316", "#1d4ed8", "#7c3aed", "#dc2626"];

function ChartsPanel({ subjectBreakdown, studyHoursByDay }) {
  return (
    <section className="charts-grid">
      <article className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Completion by subject</p>
            <h2>Assignment distribution</h2>
          </div>
        </div>
        {subjectBreakdown.length ? (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={subjectBreakdown}
                  dataKey="completed"
                  nameKey="subject"
                  outerRadius={92}
                  innerRadius={52}
                >
                  {subjectBreakdown.map((entry, index) => (
                    <Cell key={entry.subject} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No subject data yet"
            description="Add assignments to unlock subject-wise insights."
          />
        )}
      </article>

      <article className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Study rhythm</p>
            <h2>Weekly focus hours</h2>
          </div>
        </div>
        {studyHoursByDay.length ? (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={studyHoursByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#ea580c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No study sessions logged"
            description="Plan study blocks and your weekly focus pattern will appear here."
          />
        )}
      </article>
    </section>
  );
}

export default ChartsPanel;
