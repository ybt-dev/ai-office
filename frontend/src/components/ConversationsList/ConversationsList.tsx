export interface ConversationMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
  };
  text: string;
}

export interface ConversationsListProps {
  messages: ConversationMessage[];
}

const ConversationsList = ({ messages }: ConversationsListProps) => {
  return (
    <div className="space-y-4 w-2/3">
      {messages.map((msg) => (
        <div key={msg.id} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
          <img
            src={msg.sender.imageUrl}
            alt={msg.sender.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">{msg.sender.name}</span>
              <span className="text-sm text-gray-400">{msg.sender.role}</span>
            </div>
            <p className="text-gray-200">{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
