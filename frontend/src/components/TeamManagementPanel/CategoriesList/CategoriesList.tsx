import { ComponentType } from 'react';
import CategoryListItem from './CategoryListItem';

export interface Category<CategoryId> {
  id: CategoryId;
  name: string;
  icon: ComponentType<{ className: string }>;
}

export interface CategoriesListProps<CategoryId> {
  categories: Category<CategoryId>[];
  selectedCategoryId: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
}

const CategoriesList = <Category,>({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoriesListProps<Category>) => {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          categoryId={category.id}
          categoryName={category.name}
          onSelect={onSelectCategory}
          isSelected={category.id === selectedCategoryId}
          Icon={category.icon}
        />
      ))}
    </ul>
  );
};

export default CategoriesList;
