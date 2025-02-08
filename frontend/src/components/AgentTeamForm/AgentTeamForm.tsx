import { useState } from "react";
import { AgentTeam } from "~/api/AgentTeamsApi";

export interface AgentTeamFormData {
  name: string;
  description: string;
  strategy: string;
}

export interface AgentTeamFormProps {
  existingAgentTeam?: AgentTeam;
  onSubmit: (data: AgentTeamFormData) => void;
}

const AgentTeamForm = ({ onSubmit }: AgentTeamFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      name,
      description,
      strategy,
    });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-4 w-full">
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter team description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="strategy" className="block text-gray-300 mb-2">
            Strategy
          </label>
          <textarea
            id="strategy"
            placeholder="Enter team strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Team
        </button>
      </form>
    </div>
  );
};

export default AgentTeamForm;
