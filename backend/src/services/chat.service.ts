type ChatThread = {
  id: string;
  title: string;
  type: 'GENERAL' | 'MODULE_REVIEW' | 'REGISTRY_REVIEW';
  lastMessageAt: string;
  unreadCount: number;
  mentorId: string;
  memberId: string;
  linkedTaskId?: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  author: 'member' | 'mentor';
  text: string;
  timestamp: string;
  read: boolean;
};

const threads: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Registry Review · Nursery Staples',
    type: 'REGISTRY_REVIEW',
    lastMessageAt: '2024-03-18T14:22:00Z',
    unreadCount: 2,
    mentorId: 'mentor-1',
    memberId: 'member-1',
    linkedTaskId: 'task-1',
  },
  {
    id: 'thread-2',
    title: 'Module Review · Car Seat Masterclass',
    type: 'MODULE_REVIEW',
    lastMessageAt: '2024-03-17T11:02:00Z',
    unreadCount: 0,
    mentorId: 'mentor-1',
    memberId: 'member-1',
  },
  {
    id: 'thread-3',
    title: 'General Concierge',
    type: 'GENERAL',
    lastMessageAt: '2024-03-16T16:10:00Z',
    unreadCount: 0,
    mentorId: 'mentor-1',
    memberId: 'member-1',
  },
];

const messages: ChatMessage[] = [
  {
    id: 'msg-1',
    threadId: 'thread-1',
    author: 'mentor',
    text: 'How did the nursery install go?',
    timestamp: '2024-03-18T14:20:00Z',
    read: false,
  },
  {
    id: 'msg-2',
    threadId: 'thread-1',
    author: 'member',
    text: 'Wallpaper finally up! Need eyes on rocker placement.',
    timestamp: '2024-03-18T14:21:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    threadId: 'thread-2',
    author: 'member',
    text: 'Requesting review on the module worksheet.',
    timestamp: '2024-03-17T11:00:00Z',
    read: true,
  },
];

type ThreadOptions = {
  userId?: string;
  role?: 'member' | 'mentor' | 'admin';
};

export const listThreads = async (options: ThreadOptions = {}) => {
  const { userId, role } = options;
  if (!userId) {
    return threads;
  }

  return threads.filter((thread) =>
    role === 'mentor' ? thread.mentorId === userId : thread.memberId === userId,
  );
};

export const listMessages = async (threadId: string) => {
  return messages.filter((message) => message.threadId === threadId);
};

export const createMessage = async (threadId: string, author: 'member' | 'mentor', text: string) => {
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    threadId,
    author,
    text,
    timestamp: new Date().toISOString(),
    read: author === 'mentor',
  };
  messages.push(message);

  const thread = threads.find((item) => item.id === threadId);
  if (thread) {
    thread.lastMessageAt = message.timestamp;
    thread.unreadCount = author === 'mentor' ? thread.unreadCount + 1 : Math.max(0, thread.unreadCount - 1);
  }

  // TODO: Emit typing indicators + realtime updates via Pusher/Supabase
  return message;
};
