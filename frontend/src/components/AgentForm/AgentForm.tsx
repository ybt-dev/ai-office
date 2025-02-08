import { FormEvent, useState, ReactNode } from "react";
import { AgentRole } from "@/api/AgentsApi";
import { tailwindClsx } from "@/utils";

export interface AgentFormData {
  name: string;
  role: AgentRole;
  description: string;
  model: string;
  modelApiKey: string;
}

interface AgentFormProps {
  className?: string;
  innerContainerClassName?: string;
  header?: ReactNode;
  initialData?: AgentFormData;
  onSubmit: (data: AgentFormData) => void;
  children: (data: AgentFormData) => ReactNode;
  hideRoleInput?: boolean;
}

const AgentForm = ({ className, innerContainerClassName, header, initialData, onSubmit, children, hideRoleInput }: AgentFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [modelApiKey, setModelApiKey] = useState(initialData?.modelApiKey || '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    onSubmit({
      name,
      role: role as AgentRole,
      description,
      model,
      modelApiKey,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={tailwindClsx('rounded-lg bg-gray-800 text-gray-100 overflow-hidden', className)}
    >
      {header}
      <div className={tailwindClsx('space-y-4', innerContainerClassName)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">
              Agent Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {!hideRoleInput && <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-400">
              Agent Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">
              Agent Description
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
            <label htmlFor="model" className="block text-sm font-medium text-gray-400">
              Model (AI model)
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
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
              value={modelApiKey}
              onChange={(event) => setModelApiKey(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {children({
          name,
          role: role as AgentRole,
          description,
          model,
          modelApiKey,
        })}
      </div>
    </form>
  );
};

export default AgentForm;
