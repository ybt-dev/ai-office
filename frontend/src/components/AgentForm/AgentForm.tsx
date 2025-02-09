import { FormEvent, ReactNode, useState } from 'react';
import { Wallet, parseEther } from 'ethers';
import { useWalletClient, usePublicClient } from 'wagmi';
import { toast } from 'react-toastify';
import { AgentRole } from '@/api/AgentsApi';
import { tailwindClsx } from '@/utils';
import { waitForTransactionReceipt, getPublicClient } from '@wagmi/core';
import { type PublicClient } from 'viem';

export interface AgentFormData {
  name: string;
  role: AgentRole;
  description: string;
  model: string;
  modelApiKey: string;
  twitterCookie?: string;
  ethAmount?: string;
  walletAddress: string;
  encryptedPrivateKey: string;
}

interface AgentResponse {
  walletAddress: string;
  encryptedPrivateKey: string;
}

interface AgentFormProps {
  className?: string;
  innerContainerClassName?: string;
  header?: ReactNode;
  initialData?: AgentFormData;
  onSubmit: (data: AgentFormData) => Promise<AgentResponse>;
  children: (data: AgentFormData) => ReactNode;
  hideRoleInput?: boolean;
}

const AgentForm = ({
  className,
  innerContainerClassName,
  header,
  initialData = {} as AgentFormData,
  onSubmit,
  children,
  hideRoleInput,
}: AgentFormProps) => {
  const { data: walletClient } = useWalletClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [modelApiKey, setModelApiKey] = useState(initialData?.modelApiKey || '');
  const [twitterCookie, setTwitterCookie] = useState(initialData?.twitterCookie || '');
  const [ethAmount, setEthAmount] = useState(initialData?.ethAmount || '');
  const [response, setResponse] = useState<AgentResponse | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name,
      role: role as AgentRole,
      description,
      model,
      modelApiKey,
      twitterCookie,
      ethAmount,
    };

    console.log('Submitting form data:', formData);

    try {
      // Submit form and get response with wallet info
      const agentResponse = (await onSubmit(formData)) as AgentResponse;
      setResponse(agentResponse);
      console.log('Agent creation response:', agentResponse);

      // Use the wallet address from the response for the ETH transfer
      if (role === AgentRole.Producer && ethAmount && walletClient && agentResponse) {
        try {
          const tx = await walletClient.sendTransaction({
            to: agentResponse.walletAddress,
            value: parseEther(ethAmount),
          });

          toast.info('Sending ETH to agent wallet...');
          const publicClient = getPublicClient() as PublicClient;
          await waitForTransactionReceipt(publicClient, { hash: tx });
          toast.success(`Successfully sent ${ethAmount} ETH to agent wallet`);
        } catch (error) {
          console.error('Transaction failed:', error);
          toast.error('Failed to send ETH to agent wallet. Please try sending manually.');
        }
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      console.error('Error details:', error);
      toast.error('Failed to create agent');
    } finally {
      setIsSubmitting(false);
    }
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
              required
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {!hideRoleInput && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-400">
                Agent Role
              </label>
              <input
                required
                type="text"
                list="roleOptions"
                id="role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <datalist id="roleOptions">
                {Object.values(AgentRole).map((roleOption) => (
                  <option key={roleOption} value={roleOption} />
                ))}
              </datalist>
            </div>
          )}
          {role === AgentRole.Adviser || role === AgentRole.Influencer ? (
            <div>
              <label htmlFor="twitterCookie" className="block text-sm font-medium text-gray-400">
                Twitter Cookie
              </label>
              <input
                type="text"
                id="twitterCookie"
                name="twitterCookie"
                value={twitterCookie}
                onChange={(event) => setTwitterCookie(event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ) : null}
          {role === AgentRole.Producer && (
            <div>
              <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-400">
                ETH Amount to Fund Agent
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.000001"
                  id="ethAmount"
                  name="ethAmount"
                  value={ethAmount}
                  onChange={(event) => setEthAmount(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">ETH</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                This amount will be transferred to the agent's wallet after creation
              </p>
            </div>
          )}
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
              required
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
              required
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
          ethAmount,
          walletAddress: response?.walletAddress || '',
          encryptedPrivateKey: response?.encryptedPrivateKey || '',
        })}

        {isSubmitting && (
          <div className="text-sm text-gray-400 mt-2">
            Processing... Please confirm any wallet transactions if prompted.
          </div>
        )}
      </div>
    </form>
  );
};

export default AgentForm;
