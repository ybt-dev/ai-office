import { AgentRole } from "~/api/AgentsApi";
import ConversationsList from "~/components/ConversationsList";

const TeamConversation = () => {
  return (
    <div className="flex w-full">
      <ConversationsList
        messages={[{ id: '1', sender: { id: '123', name: '123', imageUrl: '', role: AgentRole.Producer }, text: 'How are you?' }]}
      />
    </div>
  );
};

export default TeamConversation;
