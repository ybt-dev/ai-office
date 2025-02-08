import { useParams } from "react-router";
import useListLatestAgentMessagesQuery from "@/hooks/queries/useListLatestAgentMessagesQuery";
import useAgentTeamInteractionByIdQuery from "@/hooks/queries/useAgentTeamInteractionByIdQuery";
import AgentMessagesList from "@/components/AgentMessagesList/AgentMessagesList";
import Skeleton from "@/components/Skeleton";

const TeamInteractionDetails = () => {
  const { interactionId } = useParams<{ interactionId: string; }>();

  const { data: messages } = useListLatestAgentMessagesQuery(interactionId || '');
  const { data: agentTeamInteraction } = useAgentTeamInteractionByIdQuery(interactionId || '');

  const renderMessageDetails = () => {
    if (!agentTeamInteraction) {
      return (
        <>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </>
      );
    }

    return (
      <>
        <h1 className="text-2xl font-bold text-white">{agentTeamInteraction.title}</h1>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Initial Request:</h2>
          <p className="text-gray-300">{agentTeamInteraction.requestContent}</p>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-6 mb-4">
        {renderMessageDetails()}
      </div>
      <AgentMessagesList messages={messages ?? null} />
    </div>
  );
};

export default TeamInteractionDetails;
