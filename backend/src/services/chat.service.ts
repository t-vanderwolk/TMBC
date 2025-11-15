type ChatThread = {
  id: string;
  title: string;
  lastMessageAt: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  author: 'member' | 'mentor';
  text: string;
  timestamp: string;
};

const threads: ChatThread[] = [
  { id: 'thread-1', title: 'Mentor Thread', lastMessageAt: '2024-03-18T14:22:00Z' },
];

const messages: ChatMessage[] = [
  { id: 'msg-1', threadId: 'thread-1', author: 'mentor', text: 'How did the nursery install go?', timestamp: '2024-03-18T14:20:00Z' },
  { id: 'msg-2', threadId: 'thread-1', author: 'member', text: 'Wallpaper finally up! Need eyes on rocker placement.', timestamp: '2024-03-18T14:21:00Z' },
];

export const listThreads = async () => {
  // TODO: replace with Prisma chat threads per user
  return threads;
};

export const listMessages = async (threadId: string) => {
  // TODO: paginate messages via Prisma or Supabase
  return messages.filter((message) => message.threadId === threadId);
};

export const createMessage = async (threadId: string, author: 'member' | 'mentor', text: string) => {
  // TODO: persist to chat service / realtime backend
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    threadId,
    author,
    text,
    timestamp: new Date().toISOString(),
  };
  messages.push(message);
  return message;
};
