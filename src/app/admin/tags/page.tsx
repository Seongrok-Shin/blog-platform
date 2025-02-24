import { getTags } from "@/lib/apis/tag";
import TagForm from "@/components/TagForm";
import TagList from "@/components/TagList";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tags</h1>
      <div className="grid gap-6">
        <TagForm />
        <TagList tags={tags} />
      </div>
    </div>
  );
}
