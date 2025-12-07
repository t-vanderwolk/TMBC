import { useCallback, useEffect, useState } from "react";

import { EventItem, getUpcomingEvents } from "@/lib/api/events";

export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUpcomingEvents();
      setEvents(response.data ?? []);
    } catch (err) {
      console.error("Unable to load upcoming events", err);
      setError("Unable to load upcoming events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { events, isLoading, error, refresh };
};
