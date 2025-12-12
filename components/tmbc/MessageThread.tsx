import MessageBubble from "@/components/tmbc/MessageBubble";

export type MessageThreadProps = {
  messages: {
    id: string;
    author: string;
    content: string;
    at?: string;
    align?: "left" | "right";
  }[];
};

export default function MessageThread({ messages }: MessageThreadProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          author={message.author}
          content={message.content}
          timestamp={message.at}
          onRight={message.align === "right"}
        />
      ))}
    </div>
  );
}
