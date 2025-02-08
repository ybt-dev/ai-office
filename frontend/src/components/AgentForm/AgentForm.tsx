import { FormEvent, useState, ChangeEvent } from "react";
import {Agent} from "@/api/AgentsApi";

interface AgentEditFormProps {
  agent: Agent | undefined;
  onSubmit: (updatedAgent: AgentEditFormProps["agent"]) => void
  onCancel: () => void
}

const AgentForm = ({ agent, onSubmit, onCancel }: AgentEditFormProps) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    role: agent?.role || '',
    description: agent?.description || '',
    model: agent?.model || '',
    apiKey: agent?.modelApiKey || '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Edit Agent Details</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">
              Agent Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-400">
              Agent Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData?.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">
              Agent Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData?.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-400">
              Model (AI model)
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData?.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400">
              Model API Key
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formData?.apiKey}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
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

export default AgentForm;
