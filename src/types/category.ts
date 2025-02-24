export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export type CategoryFilterProps = {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
};
