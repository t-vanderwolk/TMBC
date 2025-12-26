import { generateLifestyleTags } from "@/lib/services/onboarding.service";

export type IntakeStepPayload = {
  step: string;
  answers: Record<string, unknown>;
};

export async function persistIntakeStep(payload: IntakeStepPayload) {
  const tags = generateLifestyleTags(payload.answers);
  console.log("Saving intake step", payload.step, payload.answers, tags);
  return { success: true, tags };
}
