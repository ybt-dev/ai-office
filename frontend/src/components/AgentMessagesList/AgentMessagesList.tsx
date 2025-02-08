import { AgentMessage } from "@/api/AgentMessagesApi";
import AgentMessagesListItem, { AgentMessagesListItemSkeleton } from "./AgentMessagesListItem";

export interface AgentConversationsListProps {
  messages: AgentMessage[] | null;
}

const SKELETON_MESSAGES_COUNT = 4;

const AgentMessagesList = ({ messages }: AgentConversationsListProps) => {
  return (
    <div className="space-y-6">
      {messages?.map((message) => (
        <AgentMessagesListItem
          key={message.id}
          messageId={message.id}
          senderName={message.targetAgentId}
          senderAvatarUrl={message.sourceAgentId}
          messageContent={message.content}
          messageDate={message.createdAt}
        />
      ))}
      {!messages && (
        Array.from({ length: SKELETON_MESSAGES_COUNT }).map((_, index) => (
          <AgentMessagesListItemSkeleton key={index} />
        ))
      )}
      {messages && !messages.length && (
        <p className="text-white">No messages found.</p>
      )}
    </div>
  );
};

export default AgentMessagesList;
