import { redirect } from "next/navigation";

export default function MentorCirclesPage() {
  // TODO: Merge cohorts + events into a unified mentor circles view.
  redirect("/dashboard/mentor/events");
}
