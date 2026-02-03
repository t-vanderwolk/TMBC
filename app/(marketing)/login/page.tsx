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
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <LoginForm />
    </div>
  );
}
