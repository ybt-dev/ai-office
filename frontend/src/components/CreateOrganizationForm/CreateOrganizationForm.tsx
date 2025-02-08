import { useState } from 'react';

export interface CreateOrganizationFormData {
  firstName: string;
  lastName: string;
  organizationName: string;
  email: string;
}

export interface CreateOrganizationFormProps {
  onSubmit: (data: CreateOrganizationFormData) => void;
}

const CreateOrganizationForm = ({ onSubmit }: CreateOrganizationFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      firstName,
      lastName,
      organizationName,
      email,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Create Organization
        </h2>
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="block text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="organizationName" className="block text-gray-300 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            placeholder="Enter your organization name"
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateOrganizationForm;
