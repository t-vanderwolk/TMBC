export function registerAffiliateResolutionListener(
  handler: (event: CustomEvent) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    if (event.type !== "affiliate:resolved") {
      return;
    }

    handler(event);
  };

  window.addEventListener("affiliate:resolved", listener);

  return () => {
    window.removeEventListener("affiliate:resolved", listener);
  };
}
