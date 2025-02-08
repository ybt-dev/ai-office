import {FormEvent, useState} from "react";
import { AgentTeam } from "@/api/AgentTeamsApi";

export interface AgentTeamFormData {
  name: string;
  description: string;
  strategy: string;
}

export interface AgentTeamFormProps {
  initialData?: AgentTeamFormData;
  onSubmit: (data: AgentTeamFormData) => void;
}

const AgentTeamForm = ({ initialData, onSubmit }: AgentTeamFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [strategy, setStrategy] = useState(initialData?.strategy || '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit({
      name,
      description,
      strategy,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Edit Team Settings</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-400">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="strategy" className="block text-sm font-medium text-gray-400">
              Strategy
            </label>
            <textarea
              id="strategy"
              name="strategy"
              value={strategy}
              onChange={(event) => setStrategy(event.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {}}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default AgentTeamForm;
