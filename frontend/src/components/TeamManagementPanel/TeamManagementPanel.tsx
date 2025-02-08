import CategoriesList from "~/components/TeamManagementPanel/CategoriesList/CategoriesList";

const CATEGORIES = ['Conversation', 'Strategy'];

export interface TeamManagementPanelProps {
  agentTeamName: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const TeamManagementPanel = ({ agentTeamName, selectedCategory, onSelectCategory }: TeamManagementPanelProps) => {
  return (
    <aside className="flex flex-col justify-between w-80 border-r border-t bg-[#161B21] border-[#2F343D] p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-[#777D87] text-center">{agentTeamName} Team</h2>
        <CategoriesList
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>
      <button
        onClick={() => {}}
        className="mb-4 px-3 py-3 font-bold bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </aside>
  );
};

export default TeamManagementPanel;
