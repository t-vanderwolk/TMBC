import LoginForm from "@/components/auth/LoginForm";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <LoginForm />
    </div>
  );
}
