export interface CategoriesListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoriesList = ({ selectedCategory, onSelectCategory }: CategoriesListProps) => {
  return (
    <ul className="space-y-2">
      <li
        onClick={() => onSelectCategory('agents')}
        className={`cursor-pointer p-3 rounded hover:bg-[#0D1116] font-lg font-bold transition-colors ${
          selectedCategory === 'Strategy' ? 'bg-blue-100' : ''
        }`}
      >
        Agents
      </li>
      <li
        onClick={() => onSelectCategory('conversation')}
        className={`cursor-pointer p-3 rounded hover:bg-[#0D1116] font-lg font-bold transition-colors ${
          selectedCategory === 'Conversation' ? 'bg-blue-100' : ''
        }`}
      >
        Conversation
      </li>
      <li
        onClick={() => onSelectCategory('settings')}
        className={`cursor-pointer p-3   rounded hover:bg-[#0D1116] font-lg font-bold transition-colors ${
          selectedCategory === 'Settings' ? 'bg-blue-100' : ''
        }`}
      >
        Settings
      </li>
    </ul>
  );
};

export default CategoriesList;
