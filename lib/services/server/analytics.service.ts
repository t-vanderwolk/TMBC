"use server";

export const emitRegistryAnalytics = (event: string, payload: Record<string, unknown>) => {
  void Promise.resolve().then(() => {
    console.info("[registry-analytics]", event, payload);
  });
};
