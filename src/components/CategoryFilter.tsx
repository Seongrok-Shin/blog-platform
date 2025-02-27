import { CategoryFilterProps } from "@/types/category";

export default function CategoryFilter({
  categories,
  onCategorySelect,
}: CategoryFilterProps) {
  return (
    <select
      onChange={(e) => onCategorySelect(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {" "}
          {category.name}
        </option>
      ))}
    </select>
  );
}
