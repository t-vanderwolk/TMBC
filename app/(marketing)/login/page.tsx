import LoginForm from "@/components/auth/LoginForm";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-md space-y-12">
        <section className="mb-12">
          <h2 className="mb-2 text-lg font-medium">Have an invite? Start here.</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter your code to begin setting up your account.
          </p>
          <form action="/verify" method="GET" className="space-y-3">
            <input
              type="text"
              name="code"
              required
              placeholder="Invite code"
              className="w-full rounded-xl border border-[rgba(62,47,53,0.3)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tmbc-mauve)]"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--tmbc-mauve)] py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Verify invite
            </button>
          </form>
        </section>
        <LoginForm />
      </div>
    </div>
  );
}
