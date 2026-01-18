import type { DashboardData } from '@/lib/services/server/dashboard.service';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import DashboardSection from '@/components/dashboard/ui/DashboardSection';
import { EmptyState } from '@/components/dashboard/shared/EmptyState';

type EventsAnnouncementsSectionProps = {
  dataPromise: Promise<DashboardData>;
};

const formatEventDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  } catch {
    return 'Upcoming date';
  }
};

const formatAnnouncementDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    }).format(new Date(dateString));
  } catch {
    return '';
  }
};

export default async function EventsAnnouncementsSection({ dataPromise }: EventsAnnouncementsSectionProps) {
  const data = await dataPromise;
  const events = data.events.slice(0, 2);

  return (
    <DashboardSection
      eyebrow="Announcements"
      title="Warm updates from the team"
      action={
        <ActionButton
          href="/dashboard/events"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          View all
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {data.announcement ? (
          <DashboardCard className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                {data.announcement.roomName}
              </span>
              <span className="text-[0.65rem] text-[#3E2F35]/60">
                {formatAnnouncementDate(data.announcement.createdAt)}
              </span>
            </div>
            <p className="text-lg font-serif text-[#3E2F35]">{data.announcement.snippet}</p>
            <p className="text-sm text-[#3E2F35]/70">{data.announcement.content}</p>
          </DashboardCard>
        ) : (
          // Align with the EmptyState API, which now accepts description instead of message/eyebrow.
          <EmptyState
            title="No announcements yet"
            description="You don’t need to do anything right now. When you’re ready, we’ll be right here."
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Upcoming gatherings</p>
          <ActionButton
            href="/dashboard/events"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            RSVP
          </ActionButton>
        </div>

        {events.length ? (
          <div className="space-y-3">
            {events.map((event) => (
              <DashboardCard key={event.id} className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                    {formatEventDate(event.date)}
                  </p>
                  <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5]">
                    {event.userStatus ?? 'Open'}
                  </span>
                </div>
                <h3 className="text-lg font-serif text-[#3E2F35]">{event.title}</h3>
                <p className="text-sm text-[#3E2F35]/70">
                  {event.format ?? 'Virtual'} · Hosted by {event.hostName}
                </p>
                {event.description && (
                  <p className="text-sm text-[#3E2F35]/60">{event.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                    {event.rsvpCount} RSVP{event.rsvpCount === 1 ? '' : 's'}
                  </p>
                  <ActionButton
                    href="/dashboard/events"
                    variant="ghost"
                    className="sm:w-auto"
                    fullWidth
                  >
                    View details
                  </ActionButton>
                </div>
              </DashboardCard>
            ))}
          </div>
        ) : (
          // Reuse the description slot here for consistency with the shared EmptyState.
          <EmptyState
            title="Calendar is calm"
            description="Nothing new this week. Take a breath—when you’re ready, we’ll share gentle gatherings."
          />
        )}
      </div>
    </DashboardSection>
  );
}
