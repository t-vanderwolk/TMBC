export type PlaceholderEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
};

export const fetchCuratedRegistry = async () => {
  return {
    categories: [
      { id: "stroller", title: "Strollers", reason: "Trimester 2 mobility" },
      { id: "nursery", title: "Nursery", reason: "Soft neutral palette" },
      { id: "feeding", title: "Feeding", reason: "Milk + solids rhythm" },
    ],
  };
};

export const fetchCategoryItems = async (category: string) => {
  return [
    {
      id: `${category}-1`,
      title: `Taylor-Made ${category} item`,
      price: "$189",
      image: "https://placehold.co/400x300",
      reason: "Top-rated by mentors",
    },
  ];
};

export const fetchUserTimeCapsules = async () => {
  return [
    {
      id: "capsule-1",
      title: "Due Date Whisper",
      type: "letter",
      preview: "A note about your best autumn evening.",
      scheduledFor: new Date().toISOString(),
    },
  ];
};

export const createCapsule = async (payload: Record<string, unknown>) => {
  return { ...payload, id: `capsule-${Date.now()}` };
};

export const fetchEvents = async () => {
  return [
    {
      id: "event-1",
      title: "Lab: Car Seat Intuition",
      type: "Workshop",
      date: new Date().toISOString(),
      location: "Studio A",
      description: "Hands-on time with mentors.",
    },
  ];
};

export const rsvpEvent = async (eventId: string, status: string) => {
  return { eventId, status };
};

export const fetchMessages = async () => {
  return [
    {
      id: "thread-1",
      title: "Mentor Celeste",
      author: "Mentor Celeste",
      preview: "Here is that registry link",
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const sendMessage = async (threadId: string, content: string) => {
  return { id: `msg-${Date.now()}`, threadId, content };
};

export const fetchCommunityFeed = async () => {
  return {
    announcements: [
      { id: "announce-1", message: "New cohort drop-in released." },
    ],
    mentorTips: ["Try a slow evening ritual."],
    polls: [{ id: "poll-1", question: "How is your energy?", options: ["Flowing", "Wavering"] }],
    posts: [
      {
        id: "post-1",
        author: "Mentor Harper",
        content: "Your nursery is already cuter than my house.",
        timestamp: new Date().toISOString(),
      },
    ],
  };
};
