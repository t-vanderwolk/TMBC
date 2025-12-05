import { api } from '@/lib/api';
import { requireMentor } from '@/lib/auth';

export default async function MentorDashboard() {
  const mentor = await requireMentor();
  const token = mentor.token;

  const [{ data: mentees }, { data: tasks }, { data: events }] = await Promise.all([
    api.get('/api/mentor/mentees', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    api.get('/api/mentor/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    api.get('/api/events/upcoming', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-serif text-4xl text-[#3E2F35]">Mentor Overview</h1>
        <p className="text-[#3E2F35]/70">
          Touchpoints, circles, and tasks curated for your members.
        </p>
      </section>

      <section className="dashboard-cards">
        <div className="dashboard-card">
          <p className="card-title">Active Mentees</p>
          <p className="card-value">{mentees?.length ?? 0}</p>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Pending Tasks</p>
          <p className="card-value">{tasks?.length ?? 0}</p>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Next Salon</p>
          <p className="card-value">{events?.[0]?.title ?? 'No upcoming salons'}</p>
        </div>
      </section>
    </div>
  );
}
