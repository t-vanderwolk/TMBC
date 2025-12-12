"use server";

import { saveOnboardingStep } from "@/app/(dashboard)/actions";

export async function saveIntakeStep(formData: FormData) {
  return saveOnboardingStep(formData);
}
