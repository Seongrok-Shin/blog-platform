import { getCategories } from "@/app/api/category/route";
import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="grid gap-6">
        <CategoryForm />
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
