export type AffiliatePolicy = {
  allowed: boolean;
  mode?: "education_only" | "standard";
};

export function blogAffiliatePolicy(affiliateName: string): AffiliatePolicy {
  if (affiliateName === "Formuland") {
    return {
      allowed: true,
      mode: "education_only",
    };
  }

  return { allowed: true, mode: "standard" };
}
