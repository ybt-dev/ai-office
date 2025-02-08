export interface CategoryListItemProps {
  category: string;
  onSelect(category: string): void;
  isSelected: boolean;
}

const CategoryListItem = ({ category, onSelect, isSelected }: CategoryListItemProps) => {
  return (
    <li
      onClick={() => onSelect(category)}
      className={`cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors ${
        isSelected ? 'bg-blue-100' : ''
      }`}
    >
      {category}
    </li>
  );
};

export default CategoryListItem;
