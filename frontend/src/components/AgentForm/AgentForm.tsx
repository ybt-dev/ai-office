import { useState } from 'react';
import { Agent, AgentRole } from "~/api/AgentsApi";

export interface AgentFormData {
  agentName: string;
  agentDescription: string;
  agentRole: AgentRole;
  model: string;
  modelApiKey: string;
}

export interface AgentFormProps {
  existingAgent?: Agent;
  onSubmit: (agentData: AgentFormData) => void;
  actionName: string;
  canEditRole?: boolean;
}

const AgentForm = ({ canEditRole, existingAgent, actionName, onSubmit }: AgentFormProps) => {
  const [agentName, setAgentName] = useState(existingAgent?.name || '');
  const [agentDescription, setAgentDescription] = useState(existingAgent?.description || '');
  const [agentRole, setAgentRole] = useState<AgentRole>(existingAgent?.role || AgentRole.Producer);
  const [model, setModel] = useState(existingAgent?.model || '');
  const [modelApiKey, setModelApiKey] = useState(existingAgent?.modelApiKey || '');

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      agentName,
      agentDescription,
      agentRole,
      model,
      modelApiKey,
    });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded shadow-md w-full"
      >
        <div className="mb-4">
          <label htmlFor="agentName" className="block text-gray-300 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            id="agentName"
            placeholder="Enter agent name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="agentDescription" className="block text-gray-300 mb-2">
            Agent Description
          </label>
          <textarea
            id="agentDescription"
            placeholder="Enter agent description"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        {canEditRole && <div className="mb-4">
          <label htmlFor="agentRole" className="block text-gray-300 mb-2">
            Agent Role
          </label>
          <select
            id="agentRole"
            value={agentRole}
            onChange={(e) => setAgentRole(e.target.value as AgentRole)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={AgentRole.Producer}>Producer</option>
            <option value={AgentRole.Influencer}>Influencer</option>
            <option value={AgentRole.Adviser}>Advisor</option>
          </select>
        </div>}
        <div className="mb-4">
          <label htmlFor="model" className="block text-gray-300 mb-2">
            Model (AI model)
          </label>
          <input
            type="text"
            id="model"
            placeholder="Enter AI model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-gray-300 mb-2">
            Model API Key
          </label>
          <input
            type="text"
            id="apiKey"
            placeholder="Enter API key"
            value={modelApiKey}
            onChange={(e) => setModelApiKey(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          {actionName}
        </button>
      </form>
    </div>
  );
};

export default AgentForm;
